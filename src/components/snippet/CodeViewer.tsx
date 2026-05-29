import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { colors } from '../../theme';

interface CodeViewerProps {
  code: string;
  language: string;
}

export const CodeViewer = ({ code, language }: CodeViewerProps) => {
  const { editorFontSize } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.codeBackground }]}>
      <View style={styles.header}>
        <Text style={styles.langTag}>{language.toUpperCase()}</Text>
      </View>
      <ScrollView horizontal contentContainerStyle={{ minWidth: '100%' }}>
        <ScrollView style={styles.verticalScroll}>
          <Text style={[
            styles.codeText,
            {
              color: colors.text,
              fontSize: editorFontSize,
            }
          ]}>
            {code}
          </Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
    overflow: 'hidden',
  },
  header: {
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  langTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
  },
  verticalScroll: {
    padding: 16,
  },
  codeText: {
    fontFamily: 'System',
  },
});
