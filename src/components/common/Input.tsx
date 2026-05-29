import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../theme';
import { useSettings } from '../../context/SettingsContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const { isDark } = useSettings();
  const activeColors = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: activeColors.textSecondary }]}>{label}</Text>}
      <TextInput
        placeholderTextColor={activeColors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: isDark ? '#0F1626' : '#F3F4F6',
            borderColor: error ? activeColors.error : activeColors.border,
            color: activeColors.text,
          },
          style,
        ]}
        {...props}
      />
      {error && <Text style={[styles.error, { color: activeColors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});\n