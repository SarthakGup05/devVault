import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSnippets } from '../hooks/useSnippets';
import { colors } from '../theme';
import { CodeViewer } from '../components/snippet/CodeViewer';
import { Button } from '../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { shareLocalFile } from '../services/sharing';
import { exportDataAsJson } from '../services/fileSystem';
import * as Clipboard from 'expo-clipboard';
import { BackgroundGraphics } from '../components/common/BackgroundGraphics';
import * as ImagePicker from 'expo-image-picker';
import { useAttachments } from '../hooks/useAttachments';
import { AttachmentList } from '../components/snippet/AttachmentList';
import { useNotification } from '../context/NotificationContext';
import { TouchableScale } from '../components/common/TouchableScale';



export const SnippetDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { getSnippetById, removeSnippet, toggleFavoriteSnippet } = useSnippets();
  const { addAttachment, removeAttachment } = useAttachments();
  const { showNotification } = useNotification();
  const [snippet, setSnippet] = useState<any>(null);
  const [isFav, setIsFav] = useState(false);
  const router = useRouter();

  const copyScaleAnim = useRef(new Animated.Value(1)).current;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getSnippetById(String(id));
      setSnippet(found);
      if (found) {
        setIsFav(found.isFavorite);
      }
    }
  }, [id, getSnippetById]);

  const handleToggleFavorite = () => {
    if (snippet) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleFavoriteSnippet(snippet.id);
      setIsFav(!isFav);
    }
  };

  const handleAttachImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access photos is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const imageUri = pickerResult.assets[0].uri;
      try {
        await addAttachment(snippet.id, imageUri, 'image');
        // Refresh details
        const updated = getSnippetById(snippet.id);
        setSnippet(updated);
      } catch (err) {
        alert("Failed to attach image.");
      }
    }
  };

  const handleDeleteAttachment = async (attachmentId: string, fileUri: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await removeAttachment(attachmentId, fileUri);
      // Refresh details
      const updated = getSnippetById(snippet.id);
      setSnippet(updated);
    } catch (err) {
      alert("Failed to delete attachment.");
    }
  };

  if (!snippet) {
    return (
      <View style={[styles.container, { backgroundColor: colors.base }]}>
        <Text style={{ color: colors.text }}>Loading snippet details...</Text>
      </View>
    );
  }

  const handleCopy = () => {
    Clipboard.setStringAsync(snippet.content);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showNotification({
      message: 'Code copied to clipboard!',
      type: 'info',
      duration: 2000,
    });

    Animated.sequence([
      Animated.spring(copyScaleAnim, {
        toValue: 1.25,
        useNativeDriver: true,
        friction: 4,
        tension: 100,
      }),
      Animated.spring(copyScaleAnim, {
        toValue: 1.0,
        useNativeDriver: true,
        friction: 4,
        tension: 100,
      })
    ]).start();

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const fileUri = await exportDataAsJson(
        {
          title: snippet.title,
          language: snippet.language,
          content: snippet.content,
          createdAt: snippet.createdAt,
        },
        `${snippet.title.replace(/\s+/g, '_')}_export`
      );
      await shareLocalFile(fileUri, `Export ${snippet.title}`);
    } catch (err) {
      console.error('Failed to share snippet:', err);
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    removeSnippet(snippet.id);
    showNotification({
      message: `Snippet "${snippet.title}" deleted successfully.`,
      type: 'danger',
    });
    router.back();
  };

  const activeColors = {
    background: colors.base,
    card: colors.surface,
    border: colors.surfaceHighlight,
    primary: colors.primary,
    text: colors.text,
    textSecondary: colors.subtext,
    error: colors.danger,
    success: colors.success,
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <BackgroundGraphics />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
        <TouchableScale 
          onPress={() => router.back()} 
          activeScale={0.90} 
          hapticType="selection"
          style={[styles.iconButton, { backgroundColor: activeColors.card, borderColor: activeColors.border, marginRight: 12 }]}
        >
          <Ionicons name="arrow-back" size={20} color={activeColors.primary} />
        </TouchableScale>
        <View style={styles.titleInfo}>
          <Text style={[styles.title, { color: activeColors.text }]}>{snippet.title}</Text>
          <View style={[styles.langBadge, { backgroundColor: 'rgba(137, 180, 250, 0.15)' }]}>
            <Text style={[styles.langText, { color: activeColors.primary }]}>{snippet.language.toUpperCase()}</Text>
          </View>
        </View>
        <TouchableScale 
          onPress={handleToggleFavorite} 
          activeScale={0.90} 
          hapticType="medium"
          style={[styles.iconButton, { backgroundColor: activeColors.card, borderColor: activeColors.border, marginRight: 8 }]}
        >
          <Ionicons 
            name={isFav ? "heart" : "heart-outline"} 
            size={20} 
            color={isFav ? colors.danger : activeColors.primary} 
          />
        </TouchableScale>
        <TouchableScale 
          onPress={handleShare} 
          activeScale={0.90} 
          hapticType="light"
          style={[styles.iconButton, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}
        >
          <Ionicons name="share-outline" size={20} color={activeColors.primary} />
        </TouchableScale>
      </View>

      <View style={[styles.terminal, { backgroundColor: colors.codeBackground, borderColor: activeColors.border }]}>
        <View style={styles.terminalHeader}>
          <View style={styles.trafficLights}>
            <View style={[styles.light, { backgroundColor: '#FF5F56' }]} />
            <View style={[styles.light, { backgroundColor: '#FFBD2E' }]} />
            <View style={[styles.light, { backgroundColor: '#27C93F' }]} />
          </View>
          <Text style={styles.terminalTitle}>vault_session.sh</Text>
          <TouchableScale onPress={handleCopy} activeScale={0.85} hapticType="selection">
            <Animated.View style={{ transform: [{ scale: copyScaleAnim }] }}>
              <Ionicons 
                name={copied ? "checkmark-circle" : "copy-outline"} 
                size={18} 
                color={copied ? activeColors.success : activeColors.primary} 
              />
            </Animated.View>
          </TouchableScale>
        </View>
        <CodeViewer code={snippet.content} language={snippet.language} />
      </View>

      <AttachmentList attachments={snippet.attachments || []} onDelete={handleDeleteAttachment} />

      <View style={styles.actions}>
        <Button 
          title="AI Assistant" 
          onPress={() => router.push({ pathname: '/explanation', params: { snippetId: snippet.id } })} 
          style={styles.aiBtn} 
        />
        <Button 
          title="Attach" 
          onPress={handleAttachImage} 
          variant="secondary"
          style={styles.attachBtn} 
        />
        <Button 
          title="Delete" 
          onPress={handleDelete} 
          variant="danger" 
          style={styles.deleteBtn} 
        />
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 140,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  langBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
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
  terminal: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  terminalHeader: {
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  trafficLights: {
    flexDirection: 'row',
    gap: 6,
  },
  light: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  terminalTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    fontFamily: 'System',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  aiBtn: {
    flex: 1.3,
  },
  attachBtn: {
    flex: 1.1,
  },
  deleteBtn: {
    flex: 0.9,
  },
});
