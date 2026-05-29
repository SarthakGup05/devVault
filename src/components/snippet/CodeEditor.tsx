import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

interface CodeEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  language: string;
}

export const CodeEditor = ({ value, onChangeText, language }: CodeEditorProps) => {
  const { isDark, editorFontSize } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0D1117' : '#F6F8FA' }]}>
      <View style={styles.header}>
        <Text style={styles.langTag}>{language.toUpperCase()}</Text>
      </View>
      <TextInput
        multiline
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            color: isDark ? '#C9D1D9' : '#24292E',
            fontSize: editorFontSize,
          },
        ]}
        placeholder="Paste or write your code here..."
        placeholderTextColor="#888"
      />
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  langTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
  },
  input: {
    minHeight: 180,
    padding: 16,
    fontFamily: 'System',
    textAlignVertical: 'top',
  },
});\n