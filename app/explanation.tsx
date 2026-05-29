import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAI } from '../src/hooks/useAI';
import { useSnippets } from '../src/hooks/useSnippets';
import { useSettings } from '../src/context/SettingsContext';
import { colors } from '../src/theme';

export default function ExplanationRoute() {
  const { snippetId } = useLocalSearchParams();
  const { getSnippetById } = useSnippets();
  const { explainCode, loading, error } = useAI();
  const { isDark } = useSettings();
  const activeColors = isDark ? colors.dark : colors.light;

  const [aiText, setAiText] = useState(null);

  useEffect(() => {
    if (snippetId) {
      getSnippetById(Number(snippetId)).then(async (snip) => {
        if (snip) {
          try {
            const exp = await explainCode(snip.code, snip.language);
            setAiText(exp);
          } catch (err) {
            console.error(err);
          }
        }
      });
    }
  }, [snippetId, getSnippetById, explainCode]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Text style={[styles.title, { color: activeColors.text }]}>AI Smart Review</Text>
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeColors.primary} />
          <Text style={{ color: activeColors.textSecondary, marginTop: 10 }}>Analyzing code structure...</Text>
        </View>
      )}
      {error && (
        <View style={styles.center}>
          <Text style={{ color: activeColors.error }}>{error}</Text>
        </View>
      )}
      {aiText && (
        <Text style={[styles.explanationText, { color: activeColors.text }]}>{aiText}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  center: {
    padding: 40,
    alignItems: 'center',
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
  },
});\n