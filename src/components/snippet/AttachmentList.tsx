import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { colors } from '../../theme';

interface AttachmentListProps {
  attachments: Array<{ id: number; file_name: string; file_size: number }>;
  onDelete?: (id: number) => void;
}

export const AttachmentList = ({ attachments, onDelete }: AttachmentListProps) => {
  const { isDark } = useSettings();
  const activeColors = isDark ? colors.dark : colors.light;

  if (attachments.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: activeColors.textSecondary }]}>Attachments</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {attachments.map(att => (
          <View key={att.id} style={[styles.card, { backgroundColor: isDark ? '#1F2937' : '#E5E7EB' }]}>
            <Text numberOfLines={1} style={[styles.filename, { color: activeColors.text }]}>{att.file_name}</Text>
            {onDelete && (
              <TouchableOpacity onPress={() => onDelete(att.id)}>
                <Text style={[styles.deleteText, { color: activeColors.error }]}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    width: 140,
    justifyContent: 'space-between',
    minHeight: 60,
  },
  filename: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
});\n