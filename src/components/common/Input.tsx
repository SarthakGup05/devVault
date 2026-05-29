import React, { useRef, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, Animated } from 'react-native';
import { colors } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, onFocus, onBlur, ...props }: InputProps) => {
  const [focused, setFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onBlur) onBlur(e);
  };

  const activeColors = {
    text: colors.text,
    textSecondary: colors.subtext,
    border: colors.surfaceHighlight,
    error: colors.danger,
    primary: colors.primary,
  };

  // Interpolate border color from default/error to primary/error
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? activeColors.error : activeColors.border,
      error ? activeColors.error : activeColors.primary,
    ],
  });

  // Interpolate border width slightly
  const borderWidth = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: activeColors.textSecondary }]}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: borderColor,
            borderWidth: borderWidth,
            shadowColor: activeColors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: focusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.2],
            }),
            shadowRadius: focusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 8],
            }),
          },
        ]}
      >
        <TextInput
          placeholderTextColor={activeColors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              color: activeColors.text,
            },
            style,
          ]}
          {...props}
        />
      </Animated.View>
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
  inputContainer: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    height: '100%',
    width: '100%',
    fontSize: 15,
    padding: 0,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
