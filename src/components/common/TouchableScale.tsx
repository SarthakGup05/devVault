import React, { useRef } from 'react';
import { TouchableWithoutFeedback, Animated, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TouchableScaleProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  activeScale?: number;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection' | 'none';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const TouchableScale = ({
  children,
  onPress,
  activeScale = 0.96,
  hapticType = 'light',
  style,
  disabled = false,
}: TouchableScaleProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: activeScale,
      useNativeDriver: true,
      friction: 8,
      tension: 150,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1.0,
      useNativeDriver: true,
      friction: 8,
      tension: 150,
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;
    
    // Trigger dynamic tactile ticks based on configuration
    if (hapticType === 'light') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } else if (hapticType === 'medium') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } else if (hapticType === 'heavy') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } else if (hapticType === 'selection') {
      Haptics.selectionAsync().catch(() => {});
    }

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
