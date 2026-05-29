import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';

interface TagSelectorProps {
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagSelector = ({ selectedTags, onAddTag, onRemoveTag }: TagSelectorProps) => {
  const activeColors = {
    primary: colors.primary,
    primaryLight: colors.surface,
    textSecondary: colors.subtext,
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: activeColors.textSecondary }]}>Tags</Text>
      <View style={styles.tagCloud}>
        {selectedTags.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, { backgroundColor: activeColors.primaryLight }]}
            onPress={() => onRemoveTag(tag)}
          >
            <Text style={[styles.tagText, { color: activeColors.primary }]}>#{tag} ×</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
