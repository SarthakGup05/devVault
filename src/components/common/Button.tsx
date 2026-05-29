import React from 'react';
import { TouchableWithoutFeedback, Animated, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../../theme';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = ({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) => {
  const activeColors = {
    primary: colors.primary,
    primaryLight: colors.surface,
    error: colors.danger,
  };

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 8,
      tension: 150,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1.0,
      useNativeDriver: true,
      friction: 8,
      tension: 150,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

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
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      <Animated.View style={[
        getStyles(),
        (disabled || loading) && styles.disabled,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
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
});
