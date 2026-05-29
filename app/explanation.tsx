import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAI } from '../src/hooks/useAI';
import { useSnippets } from '../src/hooks/useSnippets';
import { colors } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundGraphics } from '../src/components/common/BackgroundGraphics';
import { TouchableScale } from '../src/components/common/TouchableScale';


export default function ExplanationRoute() {
  const { snippetId } = useLocalSearchParams();
  const { getSnippetById } = useSnippets();
  const { explainCode, loading, error } = useAI();
  const router = useRouter();
  
  const activeColors = {
    background: colors.base,
    primary: colors.primary,
    text: colors.text,
    textSecondary: colors.subtext,
    error: colors.danger,
    surface: colors.surface,
    border: colors.surfaceHighlight,
  };

  const [aiText, setAiText] = useState<string | null>(null);

  // Animation values for smooth entrance transition
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    if (snippetId) {
      const snip = getSnippetById(String(snippetId));
      if (snip) {
        explainCode(snip.content, snip.language)
          .then(setAiText)
          .catch(console.error);
      }
    }
  }, [snippetId, getSnippetById, explainCode]);

  useEffect(() => {
    if (aiText && !loading) {
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(contentSlideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      contentFadeAnim.setValue(0);
      contentSlideAnim.setValue(15);
    }
  }, [aiText, loading]);

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <BackgroundGraphics />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Immersive Modal Dismiss Bar */}
        <View style={styles.header}>
        <TouchableScale 
          onPress={() => router.back()} 
          activeScale={0.90} 
          hapticType="selection"
          style={[styles.iconButton, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}
        >
          <Ionicons name="close" size={20} color={activeColors.primary} />
        </TouchableScale>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>AI Smart Review</Text>
        <View style={{ width: 44 }} />
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={activeColors.primary} />
            <Text style={[styles.statusText, { color: activeColors.textSecondary }]}>Analyzing code structure...</Text>
          </View>
          <SkeletonLoader />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={{ color: activeColors.error }}>{error}</Text>
        </View>
      )}

      {aiText && !loading && (
        <Animated.View style={{ opacity: contentFadeAnim, transform: [{ translateY: contentSlideAnim }] }}>
          <View style={[styles.card, { backgroundColor: activeColors.surface, borderColor: 'rgba(137, 180, 250, 0.05)' }]}>
            <Text style={[styles.explanationText, { color: activeColors.text }]}>{aiText}</Text>
          </View>
        </Animated.View>
      )}
      </ScrollView>
    </View>
  );
}

function SkeletonLoader() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim, width: '90%', height: 20 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim, width: '95%', height: 16 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim, width: '85%', height: 16 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim, width: '60%', height: 16 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim, width: '80%', height: 16, marginTop: 14 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim, width: '75%', height: 16 }]} />
      <Animated.View style={[styles.skeletonLine, { opacity: pulseAnim, width: '50%', height: 16 }]} />
    </View>
  );
}

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
  loadingContainer: {
    marginTop: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  skeletonContainer: {
    gap: 12,
  },
  skeletonLine: {
    backgroundColor: 'rgba(137, 180, 250, 0.15)',
    borderRadius: 6,
  },
  center: {
    padding: 40,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: 'System',
  },
});
