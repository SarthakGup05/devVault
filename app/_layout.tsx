import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { FiraCode_400Regular, FiraCode_600SemiBold } from '@expo-google-fonts/fira-code';
import { DatabaseProvider } from '../src/context/DatabaseContext';
import { SettingsProvider } from '../src/context/SettingsContext';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { AnimatedSplashScreen } from '../src/components/common/AnimatedSplashScreen';
import { View } from 'react-native';
import { NotificationProvider } from '../src/context/NotificationContext';



// Keep splash screen visible while loading resources
try {
  SplashScreen.preventAutoHideAsync().catch(() => {});
} catch (e) {
  // Suppress dev-reloads
}

// Custom unified Catppuccin Mocha Dark Theme to eliminate any white background flashes
const CatppuccinTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1E1E2E', // colors.base
    card: '#313244', // colors.surface
    text: '#CDD6F4', // colors.text
    border: '#45475A', // colors.surfaceHighlight
  },
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    FiraCode_400Regular,
    FiraCode_600SemiBold,
  });

  useEffect(() => {
    const hideSplash = async () => {
      try {
        if (loaded || error) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        // Suppress native missing view controller rejections gracefully in dev mode
      }
    };
    hideSplash();
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SettingsProvider>
      <DatabaseProvider>
        <ThemeProvider value={CatppuccinTheme}>
          <NotificationProvider>
            <View style={{ flex: 1, backgroundColor: '#1E1E2E' }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="snippet/[id]" />
                <Stack.Screen name="snippet/edit" options={{ presentation: 'modal' }} />
                <Stack.Screen name="explanation" options={{ presentation: 'modal' }} />
              </Stack>
              {showSplash && (
                <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />
              )}
            </View>
          </NotificationProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </SettingsProvider>
  );
}
