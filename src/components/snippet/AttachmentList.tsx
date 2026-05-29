import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

interface AttachmentListProps {
  attachments: Array<{ id: string; fileUri: string; fileType: string }>;
  onDelete?: (id: string) => void;
}

export const AttachmentList = ({ attachments, onDelete }: AttachmentListProps) => {
  const activeColors = {
    text: colors.text,
    textSecondary: colors.subtext,
    error: colors.danger,
    card: colors.surface,
  };

  if (attachments.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: activeColors.textSecondary }]}>Attachments</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {attachments.map(att => {
          const fileName = att.fileUri.split('/').pop() || 'file';
          return (
            <View key={att.id} style={[styles.card, { backgroundColor: activeColors.card }]}>
              <Text numberOfLines={1} style={[styles.filename, { color: activeColors.text }]}>{fileName}</Text>
              {onDelete && (
                <TouchableOpacity onPress={() => onDelete(att.id)}>
                  <Text style={[styles.deleteText, { color: activeColors.error }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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
});
