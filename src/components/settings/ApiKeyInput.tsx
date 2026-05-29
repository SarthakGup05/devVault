import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { getAiApiKey, saveAiApiKey, deleteAiApiKey } from '../../services/secureStore';

export const ApiKeyInput = () => {
  const [key, setKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const savedKey = await getAiApiKey();
      if (savedKey) {
        setKey(savedKey);
        setIsSaved(true);
      }
    };
    checkKey();
  }, []);

  const handleSave = async () => {
    if (key.trim()) {
      await saveAiApiKey(key);
      setIsSaved(true);
    }
  };

  const handleClear = async () => {
    await deleteAiApiKey();
    setKey('');
    setIsSaved(false);
  };

  return (
    <View style={styles.container}>
      <Input
        label="AI Service Provider API Key"
        placeholder="Enter your LLM Key..."
        value={key}
        onChangeText={setKey}
        secureTextEntry={!isSaved}
        editable={!isSaved}
      />
      {isSaved ? (
        <Button title="Remove Key" onPress={handleClear} variant="danger" />
      ) : (
        <Button title="Save API Key" onPress={handleSave} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
