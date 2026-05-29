import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme';
import { ApiKeyInput } from '../components/settings/ApiKeyInput';
import { StorageMetrics } from '../components/settings/StorageMetrics';

export const SettingsScreen = () => {
  const activeColors = {
    background: colors.base,
    text: colors.text,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Text style={[styles.title, { color: activeColors.text }]}>Settings</Text>
      <View style={styles.section}>
        <ApiKeyInput />
      </View>
      <View style={styles.section}>
        <StorageMetrics />
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
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
});
