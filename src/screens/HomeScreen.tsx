import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, TextInput, ScrollView } from 'react-native';
import { useSnippets } from '../hooks/useSnippets';
import { colors, typography } from '../theme';
import { useRouter } from 'expo-router';
import { Card } from '../components/common/Card';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { exportDataAsJson } from '../services/fileSystem';
import { shareLocalFile } from '../services/sharing';
import * as Clipboard from 'expo-clipboard';
import { BackgroundGraphics } from '../components/common/BackgroundGraphics';
import { TouchableScale } from '../components/common/TouchableScale';

interface StaggeredListItemProps {
  children: React.ReactNode;
  index: number;
}

export const StaggeredListItem = ({ children, index }: StaggeredListItemProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: Math.min(index * 45, 600), // Cap delay for large lists so they don't delay forever
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 90,
        friction: 8,
        delay: Math.min(index * 45, 600),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {children}
    </Animated.View>
  );
};

export const HomeScreen = () => {
  const { snippets, fetchSnippets } = useSnippets();
  const router = useRouter();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  // Animation values
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchSnippets();
    Animated.parallel([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, [fetchSnippets]);

  // Handle Quick Clipboard Paste
  const handleQuickPaste = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const clipboardContent = await Clipboard.getStringAsync();
    if (clipboardContent.trim()) {
      router.push({
        pathname: '/snippet/edit',
        params: { code: clipboardContent }
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert('Clipboard is empty!');
    }
  };

  // Handle Quick Secured Backup
  const handleSecuredBackup = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const fileUri = await exportDataAsJson(snippets, 'devvault_secure_backup');
      await shareLocalFile(fileUri, 'DevVault Secure Export');
    } catch (err) {
      console.error(err);
    }
  };

  // Compute metrics for the Hero Dashboard
  const totalSnippets = snippets.length;
  
  // Calculate language distribution
  const languagesCount = snippets.reduce((acc: { [key: string]: number }, snip) => {
    const lang = snip.language.trim().toLowerCase();
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});
  
  const uniqueLanguages = Object.keys(languagesCount);
  const totalLanguages = uniqueLanguages.length;

  // Language colors for chart representation
  const languageColors: { [key: string]: string } = {
    typescript: colors.primary,
    javascript: '#F1FA8C', // Dracula yellow style
    python: colors.secondary,
    shell: colors.success,
    html: colors.danger,
    css: '#FF79C6',
    go: '#8BE9FD',
    rust: '#FF5555',
  };

  // Filter snippets based on search and active language filter chip
  const filteredSnippets = snippets.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesLang = false;
    if (selectedLanguage === 'All') {
      matchesLang = true;
    } else if (selectedLanguage === 'Favorites') {
      matchesLang = item.isFavorite;
    } else {
      matchesLang = item.language.toLowerCase().trim() === selectedLanguage.toLowerCase().trim();
    }
    
    return matchesSearch && matchesLang;
  });

  const activeColors = {
    background: colors.base,
    primary: colors.primary,
    secondary: colors.secondary,
    text: colors.text,
    textSecondary: colors.subtext,
    surface: colors.surface,
    border: colors.surfaceHighlight,
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <BackgroundGraphics />
      {/* 1. Header & Hero Dashboard */}
      <Animated.View style={{ opacity: headerFadeAnim }}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: activeColors.text }]}>DevVault</Text>
            <Text style={[styles.subtitle, { color: activeColors.textSecondary }]}>Secure local code ledger</Text>
          </View>
          <TouchableScale 
            activeScale={0.93}
            onPress={() => router.push('/snippet/edit')} 
            style={[styles.addBtn, { backgroundColor: activeColors.primary }]}
          >
            <Ionicons name="add" size={20} color="#1E1E2E" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableScale>
        </View>

        {/* Hero Statistics Widget */}
        <View style={[styles.dashboard, { backgroundColor: activeColors.surface, borderColor: 'rgba(137, 180, 250, 0.05)' }]}>
          <View style={styles.statCol}>
            <Text style={[styles.statNum, { color: activeColors.primary }]}>{totalSnippets}</Text>
            <Text style={[styles.statLabel, { color: activeColors.textSecondary }]}>Snippets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={[styles.statNum, { color: activeColors.secondary }]}>{totalLanguages}</Text>
            <Text style={[styles.statLabel, { color: activeColors.textSecondary }]}>Languages</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Ionicons name="shield-checkmark" size={24} color={colors.success} />
            <Text style={[styles.statLabel, { color: activeColors.textSecondary, marginTop: 4 }]}>OFFLINE SYNC</Text>
          </View>
        </View>
      </Animated.View>

      {/* 2. Interactive Scrolling Sections */}
      <Animated.ScrollView 
        style={{ flex: 1, transform: [{ translateY: contentSlideAnim }] }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Quick Action Grid Row */}
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableScale 
            activeScale={0.97} 
            onPress={handleQuickPaste} 
            style={[styles.actionCard, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(203, 166, 247, 0.15)' }]}>
              <Ionicons name="clipboard-outline" size={20} color={activeColors.secondary} />
            </View>
            <Text style={[styles.actionLabel, { color: activeColors.text }]}>Quick Paste</Text>
            <Text style={[styles.actionSub, { color: activeColors.textSecondary }]}>Import from device clipboard</Text>
          </TouchableScale>

          <TouchableScale 
            activeScale={0.97} 
            onPress={handleSecuredBackup} 
            style={[styles.actionCard, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(166, 227, 161, 0.15)' }]}>
              <Ionicons name="shield-half-outline" size={20} color={colors.success} />
            </View>
            <Text style={[styles.actionLabel, { color: activeColors.text }]}>Vault Backup</Text>
            <Text style={[styles.actionSub, { color: activeColors.textSecondary }]}>Create encrypted JSON export</Text>
          </TouchableScale>
        </View>

        {/* Language Allocation Bar Chart */}
        {totalSnippets > 0 && (
          <View style={styles.chartSection}>
            <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Language Allocation</Text>
            <Card style={styles.chartCard}>
              <View style={styles.barContainer}>
                {uniqueLanguages.map((lang, idx) => {
                  const count = languagesCount[lang] || 0;
                  const pct = (count / totalSnippets) * 100;
                  const barColor = languageColors[lang] || colors.primary;
                  return (
                    <View 
                      key={lang} 
                      style={[
                        styles.barSegment, 
                        { 
                          width: `${pct}%`, 
                          backgroundColor: barColor,
                          borderTopLeftRadius: idx === 0 ? 8 : 0,
                          borderBottomLeftRadius: idx === 0 ? 8 : 0,
                          borderTopRightRadius: idx === uniqueLanguages.length - 1 ? 8 : 0,
                          borderBottomRightRadius: idx === uniqueLanguages.length - 1 ? 8 : 0,
                        }
                      ]} 
                    />
                  );
                })}
              </View>
              {/* Legend List */}
              <View style={styles.legendContainer}>
                {uniqueLanguages.map(lang => {
                  const count = languagesCount[lang] || 0;
                  const pct = Math.round((count / totalSnippets) * 100);
                  const barColor = languageColors[lang] || colors.primary;
                  return (
                    <View key={lang} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: barColor }]} />
                      <Text style={[styles.legendText, { color: activeColors.textSecondary }]}>
                        {lang.toUpperCase()} ({pct}%)
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          </View>
        )}

        {/* Dynamic Search Component */}
        <View style={[styles.searchBar, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]}>
          <Ionicons name="search-outline" size={18} color={activeColors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search code content or title..."
            placeholderTextColor={activeColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: activeColors.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableScale onPress={() => setSearchQuery('')} activeScale={0.8} hapticType="selection">
              <Ionicons name="close-circle" size={18} color={activeColors.textSecondary} />
            </TouchableScale>
          )}
        </View>

        {/* Quick Filter Horizontal Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.chipsContainer}
        >
          {['All', 'Favorites', 'TypeScript', 'JavaScript', 'Python', 'Shell', 'HTML', 'Go', 'Rust'].map(lang => {
            const isSelected = selectedLanguage.toLowerCase() === lang.toLowerCase();
            return (
              <TouchableScale
                key={lang}
                activeScale={0.94}
                hapticType="selection"
                onPress={() => {
                  setSelectedLanguage(lang);
                }}
                style={[
                  styles.filterChip,
                  { 
                    backgroundColor: isSelected ? 'rgba(137, 180, 250, 0.16)' : activeColors.surface,
                    borderColor: isSelected ? activeColors.primary : activeColors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }
                ]}
              >
                {lang === 'Favorites' && (
                  <Ionicons name="heart" size={13} color={isSelected ? colors.danger : colors.subtext} />
                )}
                <Text style={[styles.chipText, { color: isSelected ? activeColors.primary : activeColors.textSecondary, fontWeight: isSelected ? '700' : '600' }]}>
                  {lang}
                </Text>
              </TouchableScale>
            );
          })}
        </ScrollView>

        {/* 3. Main Snippet List */}
        <Text style={[styles.sectionTitle, { color: activeColors.text, marginBottom: 12 }]}>Your Ledger</Text>
        <FlatList
          data={filteredSnippets}
          keyExtractor={item => item.id}
          scrollEnabled={false} // Disable nested FlatList scrolling inside ScrollView
          renderItem={({ item, index }) => (
            <StaggeredListItem index={index}>
              <TouchableScale 
                activeScale={0.97}
                onPress={() => router.push({
                  pathname: '/snippet/[id]',
                  params: { id: item.id }
                })}
              >
                <Card style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.snippetTitle, { color: activeColors.text }]}>{item.title}</Text>
                    <View style={[styles.langBadge, { backgroundColor: 'rgba(137, 180, 250, 0.12)' }]}>
                      <Text style={[styles.langText, { color: activeColors.primary }]}>{item.language.toLowerCase()}</Text>
                    </View>
                  </View>
                  <Text numberOfLines={2} style={[styles.codePreview, { color: activeColors.textSecondary }]}>
                    {item.content}
                  </Text>
                </Card>
              </TouchableScale>
            </StaggeredListItem>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={48} color={activeColors.textSecondary} style={styles.emptyIcon} />
              <Text style={[styles.emptyText, { color: activeColors.textSecondary }]}>No snippets matches found.</Text>
            </View>
          }
        />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: typography.fonts.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: typography.fonts.regular,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  addBtnText: {
    color: '#1E1E2E',
    fontFamily: typography.fonts.bold,
    marginLeft: 4,
    fontSize: 14,
  },
  dashboard: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    marginBottom: 10,
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 24,
    fontFamily: typography.fonts.bold,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1.5,
    height: 36,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  scrollContainer: {
    paddingBottom: 140, // Space for custom absolute floating tab bar
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    marginTop: 20,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  actionIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    marginBottom: 4,
  },
  actionSub: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: typography.fonts.regular,
  },
  chartSection: {
    marginTop: 6,
  },
  chartCard: {
    padding: 16,
  },
  barContainer: {
    flexDirection: 'row',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14,
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    height: 48,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fonts.regular,
  },
  chipsContainer: {
    gap: 8,
    marginBottom: 20,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  snippetTitle: {
    fontSize: 17,
    fontFamily: typography.fonts.bold,
    flex: 1,
    marginRight: 10,
  },
  langBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    textTransform: 'uppercase',
  },
  codePreview: {
    fontSize: 13,
    fontFamily: typography.fonts.monospace,
    lineHeight: 18,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: typography.fonts.medium,
  },
});
