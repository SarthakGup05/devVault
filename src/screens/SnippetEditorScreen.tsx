import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSnippets } from '../hooks/useSnippets';
import { colors, typography } from '../theme';
import { Input } from '../components/common/Input';
import { CodeEditor } from '../components/snippet/CodeEditor';
import { Button } from '../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundGraphics } from '../components/common/BackgroundGraphics';
import { LanguageSelector } from '../components/common/LanguageSelector';
import * as Haptics from 'expo-haptics';
import { useAI } from '../hooks/useAI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotification } from '../context/NotificationContext';
import { TouchableScale } from '../components/common/TouchableScale';


export const SnippetEditorScreen = () => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  
  const [titleError, setTitleError] = useState<string | undefined>(undefined);
  const [codeError, setCodeError] = useState<string | undefined>(undefined);
  const [suggestion, setSuggestion] = useState('');
  
  const { addSnippet } = useSnippets();
  const { getSuggestion } = useAI();
  const { showNotification } = useNotification();
  const router = useRouter();
  
  const suggestionTimeoutRef = React.useRef<any>(null);

  // Clear timeout ref on unmount to prevent resource leaks
  React.useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  const activeColors = {
    background: colors.base,
    card: colors.surface,
    border: colors.surfaceHighlight,
    primary: colors.primary,
    text: colors.text,
  };

  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (titleError) {
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        setTitleError('Snippet name is required.');
      } else if (trimmed.length < 3) {
        setTitleError('Snippet name must be at least 3 characters.');
      } else if (trimmed.length > 50) {
        setTitleError('Snippet name cannot exceed 50 characters.');
      } else {
        setTitleError(undefined);
      }
    }
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
    setSuggestion(''); // Instant clear on typing to keep overlay completely visually responsive

    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    // Debounce triggering autocomplete search by 800ms
    if (text.length > 0) {
      suggestionTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await getSuggestion(text, title, language);
          if (res) {
            setSuggestion(res);
          }
        } catch (err) {
          console.warn('Failed to fetch AI autocomplete suggestion:', err);
        }
      }, 800);
    }

    if (codeError) {
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        setCodeError('Code content is required.');
      } else if (text.length > 10000) {
        setCodeError('Code content is too long (maximum 10,000 characters).');
      } else {
        setCodeError(undefined);
      }
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const newCode = code + suggestion;
      setCode(newCode);
      setSuggestion('');
      showNotification({
        message: 'AI code completion accepted!',
        type: 'info',
        duration: 2000,
      });
      if (codeError) {
        setCodeError(undefined);
      }
    }
  };

  const validateFields = (): boolean => {
    let isValid = true;

    // Validate Title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Snippet name is required.');
      isValid = false;
    } else if (trimmedTitle.length < 3) {
      setTitleError('Snippet name must be at least 3 characters.');
      isValid = false;
    } else if (trimmedTitle.length > 50) {
      setTitleError('Snippet name cannot exceed 50 characters.');
      isValid = false;
    } else {
      setTitleError(undefined);
    }

    // Validate Code
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setCodeError('Code content is required.');
      isValid = false;
    } else if (code.length > 10000) {
      setCodeError('Code content is too long (maximum 10,000 characters).');
      isValid = false;
    } else {
      setCodeError(undefined);
    }

    if (!isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showNotification({
        message: 'Please resolve the highlighted validation errors.',
        type: 'warning',
      });
    }

    return isValid;
  };

  const handleSave = () => {
    if (validateFields()) {
      addSnippet(title.trim(), code, language);
      showNotification({
        message: `Snippet "${title.trim()}" saved successfully!`,
        type: 'success',
      });
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <BackgroundGraphics />
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: insets.top > 0 ? insets.top : 20,
            paddingBottom: (insets.bottom > 0 ? insets.bottom : 20) + 40,
          }
        ]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Immersive Dismiss Header */}
        <View style={styles.header}>
          <TouchableScale 
            onPress={() => router.back()} 
            activeScale={0.90} 
            hapticType="selection"
            style={[styles.iconButton, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}
          >
            <Ionicons name="close" size={20} color={activeColors.primary} />
          </TouchableScale>
          <Text style={[styles.headerTitle, { color: activeColors.text }]}>New Snippet</Text>
          <View style={{ width: 44 }} />
        </View>

        <Input 
          label="Snippet Name" 
          placeholder="Title" 
          value={title} 
          onChangeText={handleTitleChange} 
          error={titleError}
        />
        <LanguageSelector selectedLanguage={language} onSelectLanguage={setLanguage} />
        
        {/* Editor Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="code-slash" size={15} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Source Code</Text>
          </View>
          <Text style={[
            styles.counterText, 
            { color: code.length > 10000 ? colors.danger : colors.subtext }
          ]}>
            {code.length.toLocaleString()} / 10,000
          </Text>
        </View>

        <CodeEditor 
          value={code} 
          onChangeText={handleCodeChange} 
          language={language} 
          error={codeError}
          suggestion={suggestion}
          onAcceptSuggestion={handleAcceptSuggestion}
        />
        <View style={styles.actions}>
          <Button title="Save Snippet" onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  actions: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: typography.fonts.medium || 'System',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  counterText: {
    fontSize: 11,
    fontFamily: typography.fonts.monospace || 'System',
    fontWeight: '600',
  },
});
