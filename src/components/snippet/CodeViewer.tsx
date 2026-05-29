import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark';
import { useSettings } from '../../context/SettingsContext';
import { typography } from '../../theme';

interface CodeViewerProps {
  code: string;
  language: string;
}

const mapLanguageToHljs = (lang: string): string => {
  if (!lang) return 'javascript';
  const clean = lang.toLowerCase().trim();
  switch (clean) {
    case 'typescript':
    case 'ts':
      return 'typescript';
    case 'javascript':
    case 'js':
      return 'javascript';
    case 'python':
    case 'py':
      return 'python';
    case 'rust':
    case 'rs':
      return 'rust';
    case 'go':
    case 'golang':
      return 'go';
    case 'shell':
    case 'bash':
    case 'sh':
    case 'shell / bash':
      return 'bash';
    case 'cpp':
    case 'c++':
      return 'cpp';
    case 'c':
      return 'c';
    case 'csharp':
    case 'c#':
    case 'cs':
      return 'csharp';
    case 'java':
      return 'java';
    case 'kotlin':
    case 'kt':
      return 'kotlin';
    case 'swift':
      return 'swift';
    case 'dart':
      return 'dart';
    case 'html':
    case 'xml':
      return 'xml';
    case 'css':
      return 'css';
    case 'sql':
      return 'sql';
    case 'json':
      return 'json';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'markdown':
    case 'md':
      return 'markdown';
    case 'ruby':
    case 'rb':
      return 'ruby';
    case 'php':
      return 'php';
    case 'r':
      return 'r';
    default:
      return clean;
  }
};

export const CodeViewer = ({ code, language }: CodeViewerProps) => {
  const { editorFontSize } = useSettings();
  
  const fontSize = editorFontSize || 14;
  const fontFamily = typography.fonts.monospace || 'Courier New';
  const normalizedLanguage = mapLanguageToHljs(language);

  return (
    <View style={styles.container}>
      <SyntaxHighlighter
        language={normalizedLanguage}
        style={atomOneDark}
        fontSize={fontSize}
        fontFamily={fontFamily}
        PreTag={ScrollView}
        CodeTag={ScrollView}
        customStyle={styles.highlighter}
      >
        {code}
      </SyntaxHighlighter>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  highlighter: {
    backgroundColor: 'transparent',
    margin: 0,
    padding: 16,
  },
});
