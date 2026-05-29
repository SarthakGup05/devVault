import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSnippets } from '../hooks/useSnippets';
import { colors } from '../theme';
import { Input } from '../components/common/Input';
import { CodeEditor } from '../components/snippet/CodeEditor';
import { Button } from '../components/common/Button';

export const SnippetEditorScreen = () => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  
  const { addSnippet } = useSnippets();
  const router = useRouter();

  const activeColors = {
    background: colors.base,
    primary: colors.primary,
  };

  const handleSave = () => {
    if (title && code) {
      addSnippet(title, code, language);
      router.back();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Input label="Snippet Name" placeholder="Title" value={title} onChangeText={setTitle} />
      <Input label="Source Language" placeholder="Language (typescript, python, etc.)" value={language} onChangeText={setLanguage} />
      <CodeEditor value={code} onChangeText={setCode} language={language} />
      <View style={styles.actions}>
        <Button title="Save Snippet" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  actions: {
    marginTop: 20,
  },
});
