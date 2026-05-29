import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  editorFontSize: number;
  setEditorFontSize: (size: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeState] = useState<ThemeMode>('system');
  const [editorFontSize, setFontSizeState] = useState(14);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('SETTINGS_THEME');
        const storedSize = await AsyncStorage.getItem('SETTINGS_FONT_SIZE');
        
        if (storedTheme) setThemeState(storedTheme as ThemeMode);
        if (storedSize) setFontSizeState(parseInt(storedSize, 10));
      } catch (err) {
        console.warn('AsyncStorage load error:', err);
      }
    };
    loadSettings();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeState(mode);
    await AsyncStorage.setItem('SETTINGS_THEME', mode);
  };

  const setEditorFontSize = async (size: number) => {
    setFontSizeState(size);
    await AsyncStorage.setItem('SETTINGS_FONT_SIZE', size.toString());
  };

  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  return (
    <SettingsContext.Provider value={{ themeMode, isDark, setThemeMode, editorFontSize, setEditorFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
