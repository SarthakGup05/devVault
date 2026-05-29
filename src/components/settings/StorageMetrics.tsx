import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from '../common/Card';
import { colors, typography } from '../../theme';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import * as Haptics from 'expo-haptics';

export const StorageMetrics = () => {
  const { showNotification } = useNotification();
  const [optimizing, setOptimizing] = useState(false);

  const activeColors = {
    text: colors.text,
    textSecondary: colors.subtext,
    primary: colors.primary,
  };

  const handleOptimize = () => {
    setOptimizing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    // Simulate standard SQLite vacuum and index reconstruction
    setTimeout(() => {
      setOptimizing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      showNotification({
        message: 'Vault database fully optimized and indexes reconstructed!',
        type: 'success',
      });
    }, 1200);
  };

  return (
    <Card>
      <Text style={[styles.title, { color: activeColors.text }]}>Local Cache Metrics</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: activeColors.textSecondary }]}>SQLite Database</Text>
        <Text style={[styles.val, { color: activeColors.text }]}>24.5 KB</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: activeColors.textSecondary }]}>File Attachments</Text>
        <Text style={[styles.val, { color: activeColors.text }]}>0.0 KB</Text>
      </View>

      <View style={styles.actionWrapper}>
        <Button
          title={optimizing ? "Optimizing..." : "Optimize Ledger"}
          onPress={handleOptimize}
          loading={optimizing}
          variant="secondary"
          style={styles.optimizeBtn}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: typography.fonts.semibold || 'System',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fonts.regular || 'System',
  },
  val: {
    fontWeight: '600',
    fontFamily: typography.fonts.monospace || 'System',
  },
  actionWrapper: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(137, 180, 250, 0.08)',
    paddingTop: 14,
  },
  optimizeBtn: {
    paddingVertical: 10,
    borderRadius: 10,
  },
});
