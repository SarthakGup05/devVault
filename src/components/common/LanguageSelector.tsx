// src/components/common/LanguageSelector.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '../../theme';

export interface LanguageOption {
  name: string;
  value: string;
  color: string;
}

export const PREDEFINED_LANGUAGES: LanguageOption[] = [
  { name: 'TypeScript', value: 'typescript', color: '#89B4FA' }, // Blue
  { name: 'JavaScript', value: 'javascript', color: '#F9E2AF' }, // Yellow
  { name: 'Python', value: 'python', color: '#3572A5' }, // Slate Blue
  { name: 'C++', value: 'cpp', color: '#F38BA8' }, // Pink/Red
  { name: 'C', value: 'c', color: '#BAC2DE' }, // Silver/Lavender
  { name: 'C#', value: 'csharp', color: '#178600' }, // Green
  { name: 'Java', value: 'java', color: '#E76F51' }, // Orange-Red
  { name: 'Kotlin', value: 'kotlin', color: '#A97BFF' }, // Purple
  { name: 'Swift', value: 'swift', color: '#F05138' }, // Swift Red
  { name: 'Rust', value: 'rust', color: '#E05A36' }, // Rust Orange
  { name: 'Go', value: 'go', color: '#00ADD8' }, // Go Cyan
  { name: 'Dart', value: 'dart', color: '#00B4AB' }, // Dart Teal
  { name: 'Shell / Bash', value: 'shell', color: '#A6E3A1' }, // Green
  { name: 'SQL', value: 'sql', color: '#89DCEB' }, // Sky Blue
  { name: 'HTML', value: 'html', color: '#E34F26' }, // HTML Red-Orange
  { name: 'CSS', value: 'css', color: '#CBA6F7' }, // Mauve
  { name: 'JSON', value: 'json', color: '#FAB387' }, // Peach/Gold
  { name: 'YAML', value: 'yaml', color: '#F9E2AF' }, // Yellow/Gold
  { name: 'Markdown', value: 'markdown', color: '#89DCEB' }, // Cyan
  { name: 'Ruby', value: 'ruby', color: '#701516' }, // Ruby Red
  { name: 'PHP', value: 'php', color: '#4F5D95' }, // PHP Purple
  { name: 'R', value: 'r', color: '#198CE7' }, // R Royal Blue
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  label?: string;
}

export const LanguageSelector = ({ selectedLanguage, onSelectLanguage, label = "Source Language" }: LanguageSelectorProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Dynamic autoscroll: centers the selected language pill in the scroll container
  useEffect(() => {
    const activeIndex = PREDEFINED_LANGUAGES.findIndex(
      (lang) => lang.value.toLowerCase() === selectedLanguage.toLowerCase()
    );
    if (activeIndex !== -1 && scrollViewRef.current) {
      const pillWidth = 110; // Approximate average pill size
      const xOffset = Math.max(0, activeIndex * pillWidth - 120);
      scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
    }
  }, [selectedLanguage]);

  const handleSelect = (lang: LanguageOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectLanguage(lang.value);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {PREDEFINED_LANGUAGES.map((lang) => {
          const isSelected = lang.value.toLowerCase() === selectedLanguage.toLowerCase();
          return (
            <TouchableOpacity
              key={lang.value}
              activeOpacity={0.8}
              onPress={() => handleSelect(lang)}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.05)' : colors.surface,
                  borderColor: isSelected ? lang.color : colors.surfaceHighlight,
                  borderWidth: isSelected ? 2 : 1.5,
                  shadowColor: isSelected ? lang.color : 'transparent',
                },
              ]}
            >
              <View style={[styles.colorDot, { backgroundColor: lang.color }]} />
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isSelected ? colors.text : colors.subtext,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 8,
    alignItems: 'center',
    height: 48,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
  },
});
