import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { CollaborationScreen } from './src/screens/CollaborationScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { MapScreen } from './src/screens/MapScreen';
import { MarketplaceScreen } from './src/screens/MarketplaceScreen';
import { colors } from './src/theme/colors';

const Tabs = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: '#ffffff',
    primary: colors.primary,
    text: colors.text,
    border: colors.border
  }
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style='dark' />
      <Tabs.Navigator screenOptions={{ headerShown: false }}>
        <Tabs.Screen name='Map' component={MapScreen} />
        <Tabs.Screen name='Feed' component={FeedScreen} />
        <Tabs.Screen name='Dashboard' component={DashboardScreen} />
        <Tabs.Screen name='Collab' component={CollaborationScreen} />
        <Tabs.Screen name='Market' component={MarketplaceScreen} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
