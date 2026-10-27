import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mfe/favorites/v1';
const FavoritesContext = createContext(null);

// A favorite is a lightweight snapshot: { schemeCode, schemeName, fundHouse? }.
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const didHydrate = useRef(false);

  // Load persisted favorites once on mount.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setFavorites(parsed);
        }
      } catch {
        // Ignore read errors — start with an empty list.
      } finally {
        didHydrate.current = true;
        setHydrated(true);
      }
    })();
  }, []);

  // Mirror to storage on every change (after initial hydration).
  useEffect(() => {
    if (!didHydrate.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites]);

  const isFavorite = useCallback(
    (schemeCode) => favorites.some((f) => String(f.schemeCode) === String(schemeCode)),
    [favorites]
  );

  const addFavorite = useCallback((fund) => {
    setFavorites((prev) => {
      if (prev.some((f) => String(f.schemeCode) === String(fund.schemeCode))) return prev;
      return [
        {
          schemeCode: fund.schemeCode,
          schemeName: fund.schemeName,
          fundHouse: fund.fundHouse ?? null,
        },
        ...prev,
      ];
    });
  }, []);

  const removeFavorite = useCallback((schemeCode) => {
    setFavorites((prev) => prev.filter((f) => String(f.schemeCode) !== String(schemeCode)));
  }, []);

  const toggleFavorite = useCallback(
    (fund) => {
      if (isFavorite(fund.schemeCode)) removeFavorite(fund.schemeCode);
      else addFavorite(fund);
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const value = useMemo(
    () => ({
      favorites,
      hydrated,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      count: favorites.length,
    }),
    [favorites, hydrated, isFavorite, addFavorite, removeFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
