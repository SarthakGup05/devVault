import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark';
import { useSettings } from '../../context/SettingsContext';
import { colors, typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableScale } from '../common/TouchableScale';

interface CodeEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  language: string;
  error?: string;
  suggestion?: string;
  onAcceptSuggestion?: () => void;
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

export const CodeEditor = ({ value, onChangeText, language, error, suggestion, onAcceptSuggestion }: CodeEditorProps) => {
  const { editorFontSize } = useSettings();
  
  const fontSize = editorFontSize || 14;
  const fontFamily = typography.fonts.monospace || 'Courier New';
  
  const lineHeight = fontSize + 5;
  const normalizedLanguage = mapLanguageToHljs(language);

  // Breathing pulse animation for AI suggestion pill
  const breatheAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (suggestion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0.98,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      breatheAnim.setValue(1);
    }
  }, [suggestion, breatheAnim]);

  // Custom wrapper component that injects suggestion ghost text at the end of token streams
  const CustomCodeTag = React.useMemo(() => {
    return ({ children, style, ...props }: any) => (
      <Text style={style} {...props}>
        {children}
        {suggestion ? (
          <Text style={{ color: '#6272a4', opacity: 0.65, fontFamily: fontFamily }}>
            {suggestion}
          </Text>
        ) : null}
      </Text>
    );
  }, [suggestion, fontFamily]);

  return (
    <View style={styles.wrapper}>
      <View style={[
        styles.container, 
        { 
          backgroundColor: colors.codeBackground,
          borderColor: error ? colors.danger : colors.surfaceHighlight,
        }
      ]}>
        <View style={styles.header}>
          <Text style={[styles.langTag, { fontFamily: typography.fonts.bold }]}>
            {language.toUpperCase()}
          </Text>
        </View>
        <View style={styles.editorContainer}>
          {/* Underlay layer: syntax highlighter positioned absolutely behind the TextInput */}
          <SyntaxHighlighter
            language={normalizedLanguage}
            style={atomOneDark}
            fontSize={fontSize}
            fontFamily={fontFamily}
            PreTag={View}
            CodeTag={CustomCodeTag}
            pointerEvents="none"
            customStyle={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 16,
              paddingRight: 16,
              margin: 0,
              borderWidth: 0,
              backgroundColor: 'transparent',
            }}
          >
            {value || ' '}
          </SyntaxHighlighter>

          {/* Overlay layer: transparent TextInput driving layout height and receiving input */}
          <TextInput
            multiline
            scrollEnabled={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
            value={value}
            onChangeText={onChangeText}
            selectionColor={colors.primary}
            style={[
              styles.input,
              {
                fontSize: fontSize,
                fontFamily: fontFamily,
                lineHeight: lineHeight,
              }
            ]}
            placeholder="Paste or write your code here..."
            placeholderTextColor={colors.subtext}
            textAlignVertical="top"
          />

          {/* Floating Neon suggestion pill with breathing scale pulse and bouncy TouchableScale */}
          {suggestion && onAcceptSuggestion ? (
            <TouchableScale
              activeScale={0.92}
              onPress={onAcceptSuggestion}
              hapticType="medium"
              style={[
                styles.suggestionPill, 
                { 
                  backgroundColor: colors.surface,
                  transform: [{ scale: breatheAnim }]
                }
              ]}
            >
              <Ionicons name="sparkles" size={14} color={colors.primary} />
              <Text style={[styles.suggestionPillText, { color: colors.primary }]}>
                Tab to Accept
              </Text>
            </TouchableScale>
          ) : null}
        </View>
      </View>
      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    width: '100%',
  },
  container: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    minHeight: 220,
  },
  header: {
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  langTag: {
    fontSize: 12,
    color: '#888',
  },
  editorContainer: {
    flex: 1,
    position: 'relative',
    minHeight: 180,
  },
  input: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    margin: 0,
    borderWidth: 0,
    color: 'transparent', // The core magic: invisible text allows underlay highlight to show through
    textAlignVertical: 'top',
    minHeight: 180,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: typography.fonts.medium || 'System',
    paddingHorizontal: 4,
  },
  suggestionPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(137, 180, 250, 0.3)',
    shadowColor: '#89B4FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  suggestionPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.semibold || 'System',
    fontWeight: '700',
  },
});
