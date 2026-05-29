import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  const activeColors = {
    card: colors.surface,
    border: colors.surfaceHighlight,
    primary: colors.primary,
    textSecondary: colors.subtext,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: activeColors.card,
          borderTopColor: activeColors.border,
        },
        tabBarActiveTintColor: activeColors.primary,
        tabBarInactiveTintColor: activeColors.textSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Vault' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
