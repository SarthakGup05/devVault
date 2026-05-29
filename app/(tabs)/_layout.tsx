import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../src/theme';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Vault',
          tabBarIcon: ({ color, size }) => <Ionicons name="code-slash" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-sharp" size={size} color={color} />
        }} 
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const [barWidth, setBarWidth] = React.useState(0);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const activeIndex = state.index;
  const paddingHorizontal = 16;
  const tabWidth = barWidth ? (barWidth - paddingHorizontal * 2) / state.routes.length : 0;

  React.useEffect(() => {
    if (tabWidth > 0) {
      Animated.spring(slideAnim, {
        toValue: paddingHorizontal + activeIndex * tabWidth,
        useNativeDriver: true,
        friction: 7.5,
        tension: 65,
      }).start();
    }
  }, [activeIndex, tabWidth]);

  return (
    <View style={styles.container}>
      <View 
        style={styles.floatingBar}
        onLayout={(e) => {
          const { width } = e.nativeEvent.layout;
          setBarWidth(width);
        }}
      >
        {/* Animated Sliding Pill Indicator */}
        {tabWidth > 0 && (
          <Animated.View 
            style={[
              styles.slidingPill, 
              { 
                width: tabWidth,
                transform: [{ translateX: slideAnim }]
              }
            ]} 
          />
        )}

        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              label={label}
              options={options}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({ isFocused, label, options, onPress }: any) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const dotOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.12 : 1.0,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();

    Animated.timing(dotOpacity, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const iconColor = isFocused ? colors.primary : colors.subtext;
  const IconComponent = options.tabBarIcon;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.tabButton}
    >
      <Animated.View style={[
        styles.iconWrapper, 
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {IconComponent ? IconComponent({ color: iconColor, size: 21 }) : null}
      </Animated.View>
      <Text style={[styles.label, { color: iconColor, fontWeight: isFocused ? '800' : '600' }]}>
        {label}
      </Text>
      {/* Mini Active Indicator Dot */}
      <Animated.View style={[styles.activeDot, { opacity: dotOpacity, backgroundColor: colors.primary }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  floatingBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(49, 50, 68, 0.92)', // Glassmorphic translucent colors.surface
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
    borderColor: 'rgba(137, 180, 250, 0.15)', // Glowing primary border
    borderWidth: 1.5,
    width: '100%',
    maxWidth: 380,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  slidingPill: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 0,
    borderRadius: 18,
    backgroundColor: 'rgba(137, 180, 250, 0.12)', // Subtle primary glow pill
    borderColor: 'rgba(137, 180, 250, 0.22)',
    borderWidth: 1,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    position: 'relative',
  },
  iconWrapper: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    position: 'absolute',
    bottom: -6,
  },
});
