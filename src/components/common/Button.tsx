import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { useSettings } from '../../context/SettingsContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = ({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) => {
  const { isDark } = useSettings();
  const activeColors = isDark ? colors.dark : colors.light;

  const getStyles = () => {
    if (variant === 'danger') return [styles.button, { backgroundColor: activeColors.error }, style];
    if (variant === 'secondary') return [styles.button, { backgroundColor: activeColors.primaryLight, borderWidth: 1, borderColor: activeColors.primary }, style];
    return [styles.button, { backgroundColor: activeColors.primary }, style];
  };

  const getTextColor = () => {
    if (variant === 'secondary') return activeColors.primary;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getStyles(), (disabled || loading) && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});\n