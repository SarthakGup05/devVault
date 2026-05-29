import React from 'react';
import { Tabs } from 'expo-router';
import { useSettings } from '../../src/context/SettingsContext';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  const { isDark } = useSettings();
  const activeColors = isDark ? colors.dark : colors.light;

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
}\n