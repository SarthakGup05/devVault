import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { useSettings } from '../../context/SettingsContext';
import { colors } from '../../theme';

export const StorageMetrics = () => {
  const { isDark } = useSettings();
  const activeColors = isDark ? colors.dark : colors.light;

  return (
    <Card>
      <Text style={[styles.title, { color: activeColors.text }]}>Local Cache Metrics</Text>
      <View style={styles.row}>
        <Text style={{ color: activeColors.textSecondary }}>SQLite Database</Text>
        <Text style={[styles.val, { color: activeColors.text }]}>24.5 KB</Text>
      </View>
      <View style={styles.row}>
        <Text style={{ color: activeColors.textSecondary }}>File Attachments</Text>
        <Text style={[styles.val, { color: activeColors.text }]}>0.0 KB</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  val: {
    fontWeight: '600',
  },
});\n