import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface AttachmentListProps {
  attachments: Array<{ id: string; fileUri: string; fileType: string }>;
  onDelete?: (id: string, fileUri: string) => void;
}

export const AttachmentList = ({ attachments, onDelete }: AttachmentListProps) => {
  const activeColors = {
    text: colors.text,
    textSecondary: colors.subtext,
    card: colors.surface,
    border: colors.surfaceHighlight,
    danger: colors.danger,
  };

  if (attachments.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: activeColors.textSecondary }]}>Attached Screenshots</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {attachments.map(att => {
          const isImage = att.fileType.toLowerCase().startsWith('image') || 
                          att.fileUri.endsWith('.jpg') || 
                          att.fileUri.endsWith('.jpeg') || 
                          att.fileUri.endsWith('.png');

          return (
            <View key={att.id} style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
              {isImage ? (
                <Image source={{ uri: att.fileUri }} style={styles.thumbnail} resizeMode="cover" />
              ) : (
                <View style={styles.documentPlaceholder}>
                  <Ionicons name="document-text-outline" size={32} color={colors.primary} />
                  <Text numberOfLines={1} style={[styles.filename, { color: activeColors.text }]}>
                    {att.fileUri.split('/').pop() || 'File'}
                  </Text>
                </View>
              )}
              
              {onDelete && (
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => onDelete(att.id, att.fileUri)} 
                  style={[styles.deleteButton, { backgroundColor: 'rgba(243, 139, 168, 0.95)' }]}
                >
                  <Ionicons name="trash" size={14} color="#1E1E2E" />
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
    marginVertical: 18,
  },
  label: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  card: {
    width: 140,
    height: 100,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  documentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  filename: {
    fontSize: 10,
    fontFamily: typography.fonts.medium,
    textAlign: 'center',
    width: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});
