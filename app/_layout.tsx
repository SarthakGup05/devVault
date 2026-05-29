import React from 'react';
import { Stack } from 'expo-router';
import { DatabaseProvider } from '../src/context/DatabaseContext';
import { SettingsProvider } from '../src/context/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <DatabaseProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="snippet/[id]" options={{ headerShown: true, title: 'Snippet Details' }} />
          <Stack.Screen name="snippet/edit" options={{ headerShown: true, title: 'New Snippet', presentation: 'modal' }} />
          <Stack.Screen name="explanation" options={{ headerShown: true, title: 'AI Assistant', presentation: 'modal' }} />
        </Stack>
      </DatabaseProvider>
    </SettingsProvider>
  );
}\n