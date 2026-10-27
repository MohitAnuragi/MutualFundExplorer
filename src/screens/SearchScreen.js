import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import FundListItem from '../components/FundListItem';
import StateView from '../components/StateView';
import Skeleton from '../components/Skeleton';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import { useFavorites } from '../context/FavoritesContext';
import { searchFunds } from '../api/mfApi';

function SkeletonRow() {
  const { spacing } = useTheme();
  return (
    <Card style={{ marginBottom: spacing.md }}>
      <Skeleton width="80%" height={18} style={{ marginBottom: 10 }} />
      <Skeleton width="45%" height={14} style={{ marginBottom: 14 }} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Skeleton width={70} height={22} radius={999} />
        <Skeleton width={60} height={22} radius={999} />
      </View>
    </Card>
  );
}

export default function SearchScreen({ navigation }) {
  const { colors, spacing } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 320);

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const runSearch = useCallback(async (q) => {
    if (!q || q.trim().length === 0) {
      setStatus('idle');
      setResults([]);
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const list = await searchFunds(q);
      setResults(list);
      setStatus('success');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    runSearch(debounced);
  }, [debounced, runSearch]);

  const openFund = (fund) => {
    Keyboard.dismiss();
    navigation.navigate('FundDetail', {
      schemeCode: fund.schemeCode,
      schemeName: fund.schemeName,
    });
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      );
    }

    if (status === 'error') {
      return (
        <StateView
          variant="error"
          title="Couldn't search"
          message={error?.message ?? 'Something went wrong. Please try again.'}
          actionLabel="Retry"
          onAction={() => runSearch(debounced)}
        />
      );
    }

    if (status === 'idle') {
      return (
        <StateView
          icon="search-outline"
          title="Find a fund"
          message="Search thousands of Indian mutual funds by name — try “HDFC Flexi Cap” or “Parag Parikh”."
        />
      );
    }

    if (status === 'success' && results.length === 0) {
      return (
        <StateView
          icon="file-tray-outline"
          title="No matches"
          message={`No funds found for “${debounced}”. Try a different name.`}
        />
      );
    }

    return (
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.schemeCode)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.md,
          paddingBottom: spacing.xxxl,
        }}
        renderItem={({ item, index }) => (
          <FundListItem
            fund={item}
            index={index}
            isFavorite={isFavorite(item.schemeCode)}
            onToggleFavorite={() =>
              toggleFavorite({ schemeCode: item.schemeCode, schemeName: item.schemeName })
            }
            onPress={() => openFund(item)}
          />
        )}
        initialNumToRender={8}
        removeClippedSubviews
      />
    );
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Explore" subtitle="Indian mutual funds, live NAV" showThemeToggle />
      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.sm }}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </SafeAreaView>
  );
}
