import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from '../screens/SearchScreen';
import FundDetailScreen from '../screens/FundDetailScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import TabBar from './TabBar';

const Tab = createBottomTabNavigator();
const ExploreStackNav = createNativeStackNavigator();
const WatchlistStackNav = createNativeStackNavigator();

// Shared screen options: a soft fade/slide between stack screens.
const stackScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: 'transparent' },
};

function ExploreStack() {
  return (
    <ExploreStackNav.Navigator screenOptions={stackScreenOptions}>
      <ExploreStackNav.Screen name="Search" component={SearchScreen} />
      <ExploreStackNav.Screen name="FundDetail" component={FundDetailScreen} />
    </ExploreStackNav.Navigator>
  );
}

function WatchlistStack() {
  return (
    <WatchlistStackNav.Navigator screenOptions={stackScreenOptions}>
      <WatchlistStackNav.Screen name="Watchlist" component={WatchlistScreen} />
      <WatchlistStackNav.Screen name="FundDetail" component={FundDetailScreen} />
    </WatchlistStackNav.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Explore" component={ExploreStack} options={{ title: 'Explore' }} />
      <Tab.Screen name="Watchlist" component={WatchlistStack} options={{ title: 'Watchlist' }} />
    </Tab.Navigator>
  );
}
