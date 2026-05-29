// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '../theme';

export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

interface NotificationConfig {
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextProps {
  showNotification: (config: NotificationConfig) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<any>(null);

  const hideNotification = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setConfig(null);
    });
  }, [slideAnim, opacityAnim]);

  const showNotification = useCallback((newConfig: NotificationConfig) => {
    // Clear active dismissal timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Trigger haptic response based on priority
    if (newConfig.type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (newConfig.type === 'danger' || newConfig.type === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setConfig(newConfig);

    // Spring slide-down animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: insets.top > 0 ? insets.top + 8 : 24,
        useNativeDriver: true,
        friction: 6,
        tension: 80,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss config
    const duration = newConfig.duration || 3000;
    timeoutRef.current = setTimeout(() => {
      hideNotification();
    }, duration);
  }, [slideAnim, opacityAnim, insets.top, hideNotification]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getNotificationDetails = () => {
    if (!config) return { icon: 'sparkles', border: colors.primary, accent: colors.primary };
    
    switch (config.type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          border: colors.success,
          accent: colors.success,
        };
      case 'danger':
        return {
          icon: 'alert-circle',
          border: colors.danger,
          accent: colors.danger,
        };
      case 'warning':
        return {
          icon: 'warning',
          border: colors.warning,
          accent: colors.warning,
        };
      case 'info':
      default:
        return {
          icon: 'sparkles',
          border: colors.primary,
          accent: colors.primary,
        };
    }
  };

  const details = getNotificationDetails();

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {config && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
              borderColor: details.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={hideNotification}
            style={styles.notificationContent}
          >
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
              <Ionicons name={details.icon as any} size={18} color={details.accent} />
            </View>
            <Text style={[styles.messageText, { color: colors.text }]}>
              {config.message}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 13,
    fontFamily: typography.fonts.semibold || 'System',
    fontWeight: '700',
    flex: 1,
  },
});
