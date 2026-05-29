import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSnippets } from '../hooks/useSnippets';
import { colors } from '../theme';
import { useRouter } from 'expo-router';
import { Card } from '../components/common/Card';

export const HomeScreen = () => {
  const { snippets, fetchSnippets } = useSnippets();
  const router = useRouter();

  const activeColors = {
    background: colors.base,
    card: colors.surface,
    border: colors.surfaceHighlight,
    primary: colors.primary,
    text: colors.text,
    textSecondary: colors.subtext,
  };

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text }]}>DevVault</Text>
        <TouchableOpacity onPress={() => router.push('/snippet/edit')} style={[styles.addBtn, { backgroundColor: activeColors.primary }]}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={snippets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push('/snippet/' + item.id)}>
            <Card style={styles.card}>
              <Text style={[styles.snippetTitle, { color: activeColors.text }]}>{item.title}</Text>
              <Text style={{ color: activeColors.primary, fontSize: 12 }}>{item.language.toUpperCase()}</Text>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: activeColors.textSecondary }}>No snippets stored yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  card: {
    marginBottom: 12,
  },
  snippetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
