/**
 * LoadingIndicator.tsx
 * Drop-in replacement for ActivityIndicator using Reanimated
 *
 * Three variants:
 *  1. "fetch"   — Fetching assignment / note
 *  2. "history" — Fetching attendance history
 *  3. "delete"  — Admin deleting database record
 *
 * Usage:
 *   <LoadingIndicator type="fetch" size={40} />
 *   <LoadingIndicator type="history" size={40} />
 *   <LoadingIndicator type="delete" size={40} />
 *
 * Install:
 *   npx expo install react-native-reanimated
 *   Add 'react-native-reanimated/plugin' to babel.config.js plugins
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

// Animated SVG components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────
const COLORS = {
  fetch: '#4F6EF7',
  history: '#22D3A5',
  delete: '#F74F4F',
};

// ─────────────────────────────────────────────
// 1. FETCH — Spinning arc (like iOS ActivityIndicator but smoother)
// ─────────────────────────────────────────────
const FetchIndicator = ({ size = 40, color = COLORS.fetch }) => {
  const rotation = useSharedValue(0);
  const arcLength = useSharedValue(0.2);

  useEffect(() => {
    // Full rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
    // Arc breathes in/out
    arcLength.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(arcLength);
    };
  }, []);

  const r = (size / 2) * 0.72;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const strokeWidth = size * 0.09;

  const groupAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const circleAnim = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - arcLength.value),
    stroke: color,
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, groupAnim]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={color}
          strokeOpacity={0.15}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Arc */}
        <AnimatedCircle
          cx={cx}
          cy={cx}
          r={r}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={circleAnim}
        />
      </Svg>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
// 2. HISTORY — Three pulsing dots (wave)
// ─────────────────────────────────────────────
const HistoryIndicator = ({ size = 40, color = COLORS.history }) => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  const animateDot = (sv: any, delay: number) => {
    sv.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 380, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 380, easing: Easing.in(Easing.ease) }),
          withDelay(240, withTiming(0, { duration: 1 })) // pause between cycles
        ),
        -1
      )
    );
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 180);
    animateDot(dot3, 360);
    return () => {
      cancelAnimation(dot1);
      cancelAnimation(dot2);
      cancelAnimation(dot3);
    };
  }, []);

  const dotSize = size * 0.2;
  const gap = size * 0.14;

  const makeDotStyle = (sv: any) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: interpolate(sv.value, [0, 1], [0, -(size * 0.28)]) }],
      opacity: interpolate(sv.value, [0, 0.4, 1], [0.35, 1, 0.35]),
    }));

  const d1 = makeDotStyle(dot1);
  const d2 = makeDotStyle(dot2);
  const d3 = makeDotStyle(dot3);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap }}>
      {[d1, d2, d3].map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: color },
            anim,
          ]}
        />
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────
// 3. DELETE — Pulsing ring that closes in (danger)
// ─────────────────────────────────────────────
const DeleteIndicator = ({ size = 40, color = COLORS.delete }) => {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Faster, urgent spin
    rotation.value = withRepeat(
      withTiming(360, { duration: 700, easing: Easing.linear }),
      -1
    );
    // Outer ring pulse — expands and fades
    pulse.value = withRepeat(
      withTiming(1.5, { duration: 900, easing: Easing.out(Easing.ease) }),
      -1
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 450 }),
        withTiming(0, { duration: 450 })
      ),
      -1
    );
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(pulse);
      cancelAnimation(opacity);
    };
  }, []);

  const r = (size / 2) * 0.65;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const strokeWidth = size * 0.1;

  const spinAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseRingAnim = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: opacity.value,
  }));

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * 0.3, // fixed gap — danger arc
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulsing outer ring */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: size / 2,
            borderWidth: strokeWidth * 0.6,
            borderColor: color,
          },
          pulseRingAnim,
        ]}
      />
      {/* Spinning dashed arc */}
      <Animated.View style={[{ width: size, height: size, position: 'absolute' }, spinAnim]}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cx}
            r={r}
            stroke={color}
            strokeOpacity={0.18}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={cx}
            cy={cx}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={arcProps}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────
// MAIN EXPORT — Drop-in replacement
// ─────────────────────────────────────────────
type IndicatorType = 'fetch' | 'history' | 'delete';

interface LoadingIndicatorProps {
  type?: IndicatorType;
  size?: number;
  color?: string;
}

export const LoadingIndicator = ({
  type = 'fetch',
  size = 40,
  color,
}: LoadingIndicatorProps) => {
  const resolvedColor = color ?? COLORS[type];

  if (type === 'fetch') return <FetchIndicator size={size} color={resolvedColor} />;
  if (type === 'history') return <HistoryIndicator size={size} color={resolvedColor} />;
  if (type === 'delete') return <DeleteIndicator size={size} color={resolvedColor} />;
  return null;
};

export default LoadingIndicator;


// ─────────────────────────────────────────────
// DEMO (optional — remove in production)
// ─────────────────────────────────────────────
import { Text, ScrollView } from 'react-native';

export const LoadingIndicatorDemo = () => (
  <ScrollView
    contentContainerStyle={{
      flex: 1,
      backgroundColor: '#0A0C14',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
      padding: 40,
    }}
  >
    <View style={{ alignItems: 'center', gap: 16 }}>
      <LoadingIndicator type="fetch" size={48} />
      <Text style={{ color: '#4F6EF7', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
        Fetching Assignment
      </Text>
    </View>

    <View style={{ alignItems: 'center', gap: 16 }}>
      <LoadingIndicator type="history" size={48} />
      <Text style={{ color: '#22D3A5', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
        Fetching Attendance
      </Text>
    </View>

    <View style={{ alignItems: 'center', gap: 16 }}>
      <LoadingIndicator type="delete" size={48} />
      <Text style={{ color: '#F74F4F', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
        Deleting Record
      </Text>
    </View>
  </ScrollView>
);
