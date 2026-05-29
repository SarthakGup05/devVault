// src/components/common/AnimatedSplashScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '../../theme';
import { BackgroundGraphics } from './BackgroundGraphics';

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen = ({ onFinish }: AnimatedSplashScreenProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const terminalScale = useRef(new Animated.Value(0.8)).current;
  const terminalOpacity = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  // Terminal logs state
  const [logs, setLogs] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('devvault@kernel:~$ ');

  useEffect(() => {
    // 1. Cursor Blinking Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    // 2. Logo Spring In Animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1.0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // 3. Terminal Rise In Animation
    Animated.parallel([
      Animated.spring(terminalScale, {
        toValue: 1.0,
        friction: 7,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(terminalOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ]).start();

    // 4. Typewriter Terminal Boot Sequence
    const logsSequence = [
      { text: 'devvault_os v1.0.0 init', delay: 300, haptic: Haptics.ImpactFeedbackStyle.Light },
      { text: '[ OK ] Initializing Secure SQLite Database...', delay: 700, haptic: Haptics.ImpactFeedbackStyle.Light },
      { text: '[ OK ] Loading schema tables v1.0.0...', delay: 1100, haptic: Haptics.ImpactFeedbackStyle.Light },
      { text: '[ OK ] Loading hardware encryption key...', delay: 1500, haptic: Haptics.ImpactFeedbackStyle.Light },
      { text: '[ OK ] Key verified. AES-256 enabled.', delay: 1900, haptic: Haptics.ImpactFeedbackStyle.Light },
      { text: '[ OK ] Session Authenticated. Welcome.', delay: 2300, success: true },
    ];

    logsSequence.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.text]);
        if (step.success) {
          setCurrentPrompt('devvault@kernel:~$ booted.');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (step.haptic) {
          Haptics.impactAsync(step.haptic);
        }
      }, step.delay);
    });

    // 5. Fade out and Finish
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3100);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <BackgroundGraphics />

      {/* Content wrapper */}
      <View style={styles.content}>
        {/* Futuristic Glowing Vault Logo */}
        <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.iconGlowWrapper}>
            <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <Defs>
                <LinearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={colors.primary} />
                  <Stop offset="0.5" stopColor={colors.secondary} />
                  <Stop offset="1" stopColor={colors.success} />
                </LinearGradient>
              </Defs>
              {/* Outer Glowing Cyber Brackets */}
              <Path 
                d="M 28 20 H 16 V 80 H 28" 
                stroke="url(#logoGrad)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <Path 
                d="M 72 20 H 84 V 80 H 72" 
                stroke="url(#logoGrad)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Center Holographic Cryptographic Keyhole Shield */}
              <Path 
                d="M 50 32 L 64 38 V 52 C 64 64 50 72 50 72 C 50 72 36 64 36 52 V 38 L 50 32 Z" 
                stroke="url(#logoGrad)" 
                strokeWidth="3.5" 
                fill="rgba(137, 180, 250, 0.08)"
                strokeLinejoin="round" 
              />
              <Path 
                d="M 50 44 V 52" 
                stroke="url(#logoGrad)" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
              <Rect x="47.5" y="52" width="5" height="5" rx="2.5" fill={colors.secondary} />
            </Svg>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>DevVault</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>SECURED LOCAL LEDGER</Text>
        </Animated.View>

        {/* Boot Console terminal */}
        <Animated.View 
          style={[
            styles.terminal, 
            { 
              opacity: terminalOpacity, 
              transform: [{ scale: terminalScale }],
              borderColor: colors.surfaceHighlight 
            }
          ]}
        >
          {/* Mock shell header */}
          <View style={styles.terminalHeader}>
            <View style={styles.trafficLights}>
              <View style={[styles.light, { backgroundColor: colors.danger }]} />
              <View style={[styles.light, { backgroundColor: colors.warning }]} />
              <View style={[styles.light, { backgroundColor: colors.success }]} />
            </View>
            <Text style={styles.terminalTitle}>kernel_boot.sh</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Console logger display */}
          <View style={[styles.terminalBody, { backgroundColor: colors.codeBackground }]}>
            {logs.map((log, index) => {
              const isOkStep = log.startsWith('[ OK ]');
              const isErrorStep = log.startsWith('[ ERR ]');
              let textColor = colors.text;
              if (isOkStep) textColor = colors.success;
              if (isErrorStep) textColor = colors.danger;

              return (
                <Text key={index} style={[styles.logText, { color: textColor }]}>
                  {log}
                </Text>
              );
            })}

            {/* Prompt with blinking caret */}
            <View style={styles.promptRow}>
              <Text style={[styles.promptText, { color: colors.primary }]}>{currentPrompt}</Text>
              <Animated.View style={[styles.cursor, { opacity: cursorOpacity, backgroundColor: colors.secondary }]} />
            </View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E1E2E', // colors.base
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 36,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  iconGlowWrapper: {
    // Create subtle glow ring behind icon
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 34,
    fontFamily: typography.fonts.bold,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    letterSpacing: 3.5,
    opacity: 0.6,
  },
  terminal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  },
  terminalHeader: {
    height: 38,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  trafficLights: {
    flexDirection: 'row',
    gap: 6,
  },
  light: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  terminalTitle: {
    fontSize: 11,
    color: '#7F849C',
    fontFamily: typography.fonts.monospace,
    fontWeight: '600',
  },
  terminalBody: {
    padding: 16,
    minHeight: 160,
    gap: 6,
  },
  logText: {
    fontSize: 11.5,
    fontFamily: typography.fonts.monospace,
    lineHeight: 15,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 11.5,
    fontFamily: typography.fonts.monospace,
  },
  cursor: {
    width: 6,
    height: 12,
    marginLeft: 4,
  },
});
