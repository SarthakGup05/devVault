// src/components/common/BackgroundGraphics.tsx
import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { colors, typography } from '../../theme';

export const BackgroundGraphics = () => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Premium Ambient Glassmorphic Glow Orbs */}
      <View style={[styles.glowOrb, { 
        backgroundColor: colors.primary, 
        top: -100, 
        right: -80, 
        width: 300, 
        height: 300, 
        borderRadius: 150,
        opacity: 0.05 
      }]} />

      <View style={[styles.glowOrb, { 
        backgroundColor: colors.secondary, 
        bottom: 80, 
        left: -100, 
        width: 360, 
        height: 360, 
        borderRadius: 180,
        opacity: 0.04 
      }]} />

      <View style={[styles.glowOrb, { 
        backgroundColor: colors.success, 
        top: SCREEN_HEIGHT * 0.4, 
        right: -150, 
        width: 250, 
        height: 250, 
        borderRadius: 125,
        opacity: 0.02 
      }]} />

      {/* Primary Full Screen Vector Overlay */}
      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFillObject}>
        <Defs>
          {/* Cyber Gradient Definition */}
          <LinearGradient id="cyberGrad" x1="0" y1="0" x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.08" />
            <Stop offset="0.5" stopColor={colors.secondary} stopOpacity="0.02" />
            <Stop offset="1" stopColor={colors.success} stopOpacity="0.08" />
          </LinearGradient>

          {/* Dash Trace Gradient */}
          <LinearGradient id="traceGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.2" />
            <Stop offset="1" stopColor={colors.secondary} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* 1. Cyber grid matrix lines */}
        {/* Vertical lines */}
        <Path d={`M ${SCREEN_WIDTH * 0.15} 0 V ${SCREEN_HEIGHT}`} stroke={colors.surfaceHighlight} strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="5 5" />
        <Path d={`M ${SCREEN_WIDTH * 0.45} 0 V ${SCREEN_HEIGHT}`} stroke={colors.surfaceHighlight} strokeWidth="0.8" strokeOpacity="0.08" />
        <Path d={`M ${SCREEN_WIDTH * 0.75} 0 V ${SCREEN_HEIGHT}`} stroke={colors.surfaceHighlight} strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="5 5" />
        
        {/* Horizontal lines */}
        <Path d={`M 0 ${SCREEN_HEIGHT * 0.12} H ${SCREEN_WIDTH}`} stroke={colors.surfaceHighlight} strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="5 5" />
        <Path d={`M 0 ${SCREEN_HEIGHT * 0.35} H ${SCREEN_WIDTH}`} stroke={colors.surfaceHighlight} strokeWidth="0.8" strokeOpacity="0.08" />
        <Path d={`M 0 ${SCREEN_HEIGHT * 0.65} H ${SCREEN_WIDTH}`} stroke={colors.surfaceHighlight} strokeWidth="0.8" strokeOpacity="0.12" strokeDasharray="5 5" />
        <Path d={`M 0 ${SCREEN_HEIGHT * 0.85} H ${SCREEN_WIDTH}`} stroke={colors.surfaceHighlight} strokeWidth="0.8" strokeOpacity="0.08" />

        {/* Cyber Dots on Intersections */}
        <Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.12} r="2.5" fill={colors.primary} fillOpacity="0.3" />
        <Circle cx={SCREEN_WIDTH * 0.75} cy={SCREEN_HEIGHT * 0.12} r="2.5" fill={colors.secondary} fillOpacity="0.3" />
        <Circle cx={SCREEN_WIDTH * 0.45} cy={SCREEN_HEIGHT * 0.35} r="3" fill={colors.success} fillOpacity="0.25" />
        <Circle cx={SCREEN_WIDTH * 0.15} cy={SCREEN_HEIGHT * 0.65} r="2.5" fill={colors.secondary} fillOpacity="0.3" />
        <Circle cx={SCREEN_WIDTH * 0.75} cy={SCREEN_HEIGHT * 0.65} r="2.5" fill={colors.primary} fillOpacity="0.3" />
        <Circle cx={SCREEN_WIDTH * 0.45} cy={SCREEN_HEIGHT * 0.85} r="2" fill={colors.primary} fillOpacity="0.2" />

        {/* 2. Micro Circuit Vector Traces */}
        {/* Top-Right Circuit Board */}
        <Path 
          d={`M ${SCREEN_WIDTH} 60 H ${SCREEN_WIDTH - 80} L ${SCREEN_WIDTH - 120} 100 V 200 L ${SCREEN_WIDTH - 160} 240 H ${SCREEN_WIDTH - 200}`} 
          stroke="url(#cyberGrad)" 
          strokeWidth="1.5" 
          strokeDasharray="6 4" 
        />
        <Circle cx={SCREEN_WIDTH - 120} cy={100} r="3.5" fill={colors.primary} fillOpacity="0.5" />
        <Circle cx={SCREEN_WIDTH - 200} cy={240} r="3" fill={colors.secondary} fillOpacity="0.4" />

        <Path 
          d={`M ${SCREEN_WIDTH} 120 H ${SCREEN_WIDTH - 60} L ${SCREEN_WIDTH - 100} 160 V 280`} 
          stroke="url(#cyberGrad)" 
          strokeWidth="1.2" 
        />
        <Circle cx={SCREEN_WIDTH - 100} cy={160} r="3" fill={colors.primary} fillOpacity="0.4" />

        {/* Bottom-Left Data Waves */}
        <Path 
          d={`M 0 ${SCREEN_HEIGHT * 0.75} Q ${SCREEN_WIDTH * 0.25} ${SCREEN_HEIGHT * 0.72} ${SCREEN_WIDTH * 0.5} ${SCREEN_HEIGHT * 0.78} T ${SCREEN_WIDTH} ${SCREEN_HEIGHT * 0.73}`} 
          stroke="url(#cyberGrad)" 
          strokeWidth="1.5" 
          fill="none"
        />
        <Path 
          d={`M 0 ${SCREEN_HEIGHT * 0.77} Q ${SCREEN_WIDTH * 0.3} ${SCREEN_HEIGHT * 0.8} ${SCREEN_WIDTH * 0.6} ${SCREEN_HEIGHT * 0.74} T ${SCREEN_WIDTH} ${SCREEN_HEIGHT * 0.82}`} 
          stroke="url(#cyberGrad)" 
          strokeWidth="1.0" 
          strokeOpacity="0.5"
          strokeDasharray="8 4"
          fill="none"
        />

        {/* 3. Immersive Low-Opacity Monospace Developer Code Glyphs */}
        {/* Rust Snippet (Top Left) */}
        <SvgText
          x={SCREEN_WIDTH * 0.08}
          y={SCREEN_HEIGHT * 0.07}
          fill={colors.primary}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.04"
        >
          {"pub fn main() -> Result<(), Error> {"}
        </SvgText>

        <SvgText
          x={SCREEN_WIDTH * 0.12}
          y={SCREEN_HEIGHT * 0.095}
          fill={colors.secondary}
          fontSize="10"
          fontFamily={typography.fonts.monospace}
          opacity="0.03"
        >
          {"let vault = Vault::new(\"offline_secure\");"}
        </SvgText>

        <SvgText
          x={SCREEN_WIDTH * 0.08}
          y={SCREEN_HEIGHT * 0.12}
          fill={colors.primary}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.04"
        >
          {"}"}
        </SvgText>

        {/* Go routine (Top Right) */}
        <SvgText
          x={SCREEN_WIDTH * 0.55}
          y={SCREEN_HEIGHT * 0.08}
          fill={colors.success}
          fontSize="10"
          fontFamily={typography.fonts.monospace}
          opacity="0.035"
        >
          {"go func() { ch <- \"devvault_sync\" }();"}
        </SvgText>

        {/* Python Snippet (Upper Middle Right) */}
        <SvgText
          x={SCREEN_WIDTH * 0.52}
          y={SCREEN_HEIGHT * 0.2}
          fill={colors.warning}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.035"
        >
          {"with open(\"ledger.bin\", \"rb\") as f:"}
        </SvgText>
        <SvgText
          x={SCREEN_WIDTH * 0.56}
          y={SCREEN_HEIGHT * 0.225}
          fill={colors.text}
          fontSize="10"
          fontFamily={typography.fonts.monospace}
          opacity="0.03"
        >
          {"data = decrypt_aes_gcm(f.read())"}
        </SvgText>

        {/* C++ snippet (Middle Left) */}
        <SvgText
          x={SCREEN_WIDTH * 0.05}
          y={SCREEN_HEIGHT * 0.28}
          fill={colors.danger}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.03"
        >
          {"#include <iostream> // sys_ok"}
        </SvgText>
        <SvgText
          x={SCREEN_WIDTH * 0.05}
          y={SCREEN_HEIGHT * 0.305}
          fill={colors.primary}
          fontSize="10"
          fontFamily={typography.fonts.monospace}
          opacity="0.03"
        >
          {"std::cout << \"Vault hash: \" << std::hex << 0x7A9D;"}
        </SvgText>

        {/* TypeScript Interface (Middle Right) */}
        <SvgText
          x={SCREEN_WIDTH * 0.48}
          y={SCREEN_HEIGHT * 0.44}
          fill={colors.secondary}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.04"
        >
          {"interface Snippet<T> { id: string; raw: T; }"}
        </SvgText>

        {/* HTML/JSX Custom Layout Tags (Center Left) */}
        <SvgText
          x={SCREEN_WIDTH * 0.05}
          y={SCREEN_HEIGHT * 0.48}
          fill={colors.warning}
          fontSize="13"
          fontFamily={typography.fonts.monospace}
          fontWeight="bold"
          opacity="0.03"
        >
          {"<SecureProvider offline={true}>"}
        </SvgText>
        <SvgText
          x={SCREEN_WIDTH * 0.09}
          y={SCREEN_HEIGHT * 0.51}
          fill={colors.success}
          fontSize="12"
          fontFamily={typography.fonts.monospace}
          opacity="0.025"
        >
          {"<SnippetVault key={0xFA7E} />"}
        </SvgText>
        <SvgText
          x={SCREEN_WIDTH * 0.05}
          y={SCREEN_HEIGHT * 0.54}
          fill={colors.warning}
          fontSize="13"
          fontFamily={typography.fonts.monospace}
          fontWeight="bold"
          opacity="0.03"
        >
          {"</SecureProvider>"}
        </SvgText>

        {/* SQL database query (Lower Middle Right) */}
        <SvgText
          x={SCREEN_WIDTH * 0.55}
          y={SCREEN_HEIGHT * 0.58}
          fill={colors.primary}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.035"
        >
          {"SELECT hash FROM local_ledger WHERE secure = 1;"}
        </SvgText>

        {/* Bash command line (Lower Left) */}
        <SvgText
          x={SCREEN_WIDTH * 0.06}
          y={SCREEN_HEIGHT * 0.68}
          fill={colors.success}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.04"
        >
          {"$ chmod 600 private.key && ./sync_local.sh"}
        </SvgText>

        {/* CSS Keyframes / responsive rules (Lower Right) */}
        <SvgText
          x={SCREEN_WIDTH * 0.45}
          y={SCREEN_HEIGHT * 0.8}
          fill={colors.secondary}
          fontSize="10"
          fontFamily={typography.fonts.monospace}
          opacity="0.03"
        >
          {"@media (prefers-color-scheme: dark) { .blur { filter: blur(20px); } }"}
        </SvgText>

        {/* Web Cryptography JS snippet (Bottom Left) */}
        <SvgText
          x={SCREEN_WIDTH * 0.08}
          y={SCREEN_HEIGHT * 0.86}
          fill={colors.success}
          fontSize="11"
          fontFamily={typography.fonts.monospace}
          opacity="0.04"
        >
          {"const hash = await crypto.subtle.digest('SHA-256', data);"}
        </SvgText>

        {/* Kernel Binary indicator (Bottom Right) */}
        <SvgText
          x={SCREEN_WIDTH * 0.58}
          y={SCREEN_HEIGHT * 0.9}
          fill={colors.secondary}
          fontSize="10"
          fontFamily={typography.fonts.monospace}
          opacity="0.03"
        >
          {"devvault_kernel.bin v1.0.0_rc3"}
        </SvgText>

        {/* Decorative brackets/braces */}
        <SvgText x={SCREEN_WIDTH * 0.85} y={SCREEN_HEIGHT * 0.45} fill={colors.primary} fontSize="32" fontFamily={typography.fonts.monospace} opacity="0.02">{"}"}</SvgText>
        <SvgText x={SCREEN_WIDTH * 0.05} y={SCREEN_HEIGHT * 0.25} fill={colors.secondary} fontSize="32" fontFamily={typography.fonts.monospace} opacity="0.02">{"{"}</SvgText>
        <SvgText x={SCREEN_WIDTH * 0.82} y={SCREEN_HEIGHT * 0.78} fill={colors.success} fontSize="28" fontFamily={typography.fonts.monospace} opacity="0.015">{"[]"}</SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  glowOrb: {
    position: 'absolute',
    // Apply large soft blur behind layout
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 50,
  },
});

