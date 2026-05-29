import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { colors } from '../../theme';

interface CodeEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  language: string;
}

export const CodeEditor = ({ value, onChangeText, language }: CodeEditorProps) => {
  const { editorFontSize } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.codeBackground }]}>
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
            color: colors.text,
            fontSize: editorFontSize,
          },
        ]}
        placeholder="Paste or write your code here..."
        placeholderTextColor={colors.subtext}
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
    backgroundColor: 'rgba(0,0,0,0.15)',
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
});
