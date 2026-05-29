import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSnippets } from '../hooks/useSnippets';
import { useSettings } from '../context/SettingsContext';
import { colors } from '../theme';
import { CodeViewer } from '../components/snippet/CodeViewer';
import { Button } from '../components/common/Button';

export const SnippetDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { getSnippetById, removeSnippet } = useSnippets();
  const [snippet, setSnippet] = useState<any>(null);
  const { isDark } = useSettings();
  const activeColors = isDark ? colors.dark : colors.light;
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getSnippetById(Number(id)).then(setSnippet);
    }
  }, [id, getSnippetById]);

  if (!snippet) {
    return (
      <View style={[styles.container, { backgroundColor: activeColors.background }]}>
        <Text style={{ color: activeColors.text }}>Loading snippet details...</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    await removeSnippet(snippet.id);
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Text style={[styles.title, { color: activeColors.text }]}>{snippet.title}</Text>
      <Text style={[styles.desc, { color: activeColors.textSecondary }]}>{snippet.description || 'No description provided.'}</Text>
      <CodeViewer code={snippet.code} language={snippet.language} />
      <View style={styles.actions}>
        <Button title="AI Code Review" onPress={() => router.push({ pathname: '/explanation', params: { snippetId: snippet.id } })} style={styles.btn} />
        <Button title="Delete" onPress={handleDelete} variant="danger" style={styles.btn} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  btn: {
    flex: 1,
  },
});\n