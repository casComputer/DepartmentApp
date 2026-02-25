import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Extrapolation,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// ── Particle ──────────────────────────────────────────────────────────────────
type ParticleProps = {
  index: number;
  trigger: number; // increments each time we want to burst
};

const COLORS = ['#63b3ff', '#a8d4ff', '#ffffff', '#3d8bef', '#90cdf4'];

function Particle({ index, trigger }: ParticleProps) {
  const progress = useSharedValue(0);

  const angle = ((Math.PI * 2) / 10) * index + (index % 3) * 0.3;
  const dist = 55 + (index % 3) * 20;
  const size = 5 + (index % 3) * 3;
  const color = COLORS[index % COLORS.length];

  React.useEffect(() => {
    if (trigger === 0) return;
    progress.value = 0;
    progress.value = withDelay(
      index * 20,
      withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) })
    );
  }, [trigger]);

  const style = useAnimatedStyle(() => {
    const tx = Math.cos(angle) * dist * progress.value;
    const ty = Math.sin(angle) * dist * progress.value;
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 1, 0], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0, 0.2, 1], [0, 1, 0.3], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX: tx }, { translateY: ty }, { scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: '50%',
          top: '55%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
        },
        style,
      ]}
    />
  );
}

// ── Cloud SVG (drawn with Views) ───────────────────────────────────────────────
function CloudShape() {
  return (
    <View style={styles.cloudContainer}>
      {/* Main body */}
      <View style={styles.cloudBody} />
      {/* Left bump */}
      <View style={[styles.cloudBump, { width: 36, height: 36, left: 8, bottom: 12 }]} />
      {/* Center bump */}
      <View style={[styles.cloudBump, { width: 48, height: 48, left: 28, bottom: 16 }]} />
      {/* Right bump */}
      <View style={[styles.cloudBump, { width: 36, height: 36, right: 8, bottom: 12 }]} />
    </View>
  );
}

// ── Upload Arrow ───────────────────────────────────────────────────────────────
function UploadArrow() {
  return (
    <View style={styles.arrowContainer}>
      {/* Shaft */}
      <View style={styles.arrowShaft} />
      {/* Left wing */}
      <View style={[styles.arrowWing, { transform: [{ rotate: '-45deg' }, { translateX: -4 }] }]} />
      {/* Right wing */}
      <View style={[styles.arrowWing, { transform: [{ rotate: '45deg' }, { translateX: 4 }] }]} />
    </View>
  );
}

// ── Progress Bar ───────────────────────────────────────────────────────────────
function ProgressBar({ open }: { open: boolean }) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (open) {
      progress.value = withDelay(400, withTiming(0.78, { duration: 1400, easing: Easing.out(Easing.quad) }));
    } else {
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [open]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, fillStyle]} />
    </View>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CloudFolderAnimation() {
  const [open, setOpen] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);

  // Folder front flap
  const flapRotate = useSharedValue(0);
  // Cloud + arrow
  const cloudY = useSharedValue(20);
  const cloudOpacity = useSharedValue(0);
  // Arrow pulse (runs when open)
  const arrowY = useSharedValue(0);
  // Whole folder nudge
  const folderY = useSharedValue(0);

  // Cloud float loop ref
  const cloudFloating = useSharedValue(0);

  const startCloudFloat = useCallback(() => {
    cloudFloating.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const stopCloudFloat = useCallback(() => {
    cloudFloating.value = withTiming(0, { duration: 300 });
  }, []);

  const handlePress = useCallback(() => {
    if (!open) {
      // OPEN
      setOpen(true);
      setBurstTrigger((t) => t + 1);

      // Flap opens
      flapRotate.value = withSpring(-45, { damping: 12, stiffness: 100 });

      // Folder nudge up
      folderY.value = withSequence(
        withTiming(-6, { duration: 150 }),
        withSpring(0, { damping: 8 })
      );

      // Cloud rises
      cloudOpacity.value = withTiming(1, { duration: 300 });
      cloudY.value = withSpring(0, { damping: 10, stiffness: 80 });

      // Arrow pulse loop
      arrowY.value = withDelay(
        300,
        withRepeat(
          withSequence(
            withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 600, easing: Easing.inOut(Easing.sin) })
          ),
          -1,
          false
        )
      );

      // Cloud float
      runOnJS(startCloudFloat)();
    } else {
      // CLOSE
      setOpen(false);

      flapRotate.value = withSpring(0, { damping: 12, stiffness: 100 });
      cloudOpacity.value = withTiming(0, { duration: 200 });
      cloudY.value = withTiming(20, { duration: 250 });
      arrowY.value = withTiming(0, { duration: 200 });
      runOnJS(stopCloudFloat)();
    }
  }, [open]);

  // Animated styles
  const flapStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateX: `${flapRotate.value}deg` }],
  }));

  const folderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: folderY.value }],
  }));

  const cloudStyle = useAnimatedStyle(() => {
    const floatOffset = interpolate(cloudFloating.value, [0, 1], [0, -7]);
    return {
      opacity: cloudOpacity.value,
      transform: [{ translateY: cloudY.value + floatOffset }],
    };
  });

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arrowY.value }],
  }));

  return (
    <View style={styles.screen}>
      {/* Background grid dots */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 80 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                left: (i % 10) * (width / 10) + 20,
                top: Math.floor(i / 10) * 80 + 30,
              },
            ]}
          />
        ))}
      </View>

      <Pressable onPress={handlePress} style={styles.scene}>
        {/* Particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Particle key={i} index={i} trigger={burstTrigger} />
        ))}

        {/* Cloud */}
        <Animated.View style={[styles.cloudWrapper, cloudStyle]}>
          <CloudShape />
          {/* Upload arrow inside cloud */}
          <Animated.View style={[styles.arrowWrapper, arrowStyle]}>
            <UploadArrow />
          </Animated.View>
        </Animated.View>

        {/* Folder */}
        <Animated.View style={[styles.folder, folderStyle]}>
          {/* Back */}
          <View style={styles.folderBack}>
            <View style={styles.folderTab} />
          </View>

          {/* Front flap */}
          <Animated.View style={[styles.folderFront, flapStyle]}>
            <ProgressBar open={open} />
            <View style={styles.folderShine} />
          </Animated.View>
        </Animated.View>

        {/* Label */}
        <Text style={[styles.label, open && styles.labelActive]}>
          {open ? 'Uploading...' : 'Tap to upload'}
        </Text>
      </Pressable>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const FOLDER_W = 200;
const FOLDER_H = 150;
const BACK_H = 130;
const FRONT_H = 110;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0a0f1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(99,179,255,0.08)',
  },
  scene: {
    width: 260,
    height: 280,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // ── Cloud ──
  cloudWrapper: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudContainer: {
    width: 100,
    height: 58,
    position: 'relative',
  },
  cloudBody: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    right: 4,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#7ec8f8',
    shadowColor: '#63b3ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  cloudBump: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#a8d4ff',
  },
  arrowWrapper: {
    position: 'absolute',
    top: 6,
    alignItems: 'center',
  },
  arrowContainer: {
    width: 20,
    height: 28,
    alignItems: 'center',
  },
  arrowShaft: {
    position: 'absolute',
    bottom: 0,
    width: 2.5,
    height: 22,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  arrowWing: {
    position: 'absolute',
    top: 0,
    width: 2.5,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'white',
    transformOrigin: 'bottom center',
  },

  // ── Folder ──
  folder: {
    width: FOLDER_W,
    height: FOLDER_H,
    marginBottom: 20,
  },
  folderBack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: FOLDER_W,
    height: BACK_H,
    backgroundColor: '#1560cc',
    borderRadius: 6,
    shadowColor: '#0f4ba8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  folderTab: {
    position: 'absolute',
    top: -18,
    left: 0,
    width: 80,
    height: 22,
    backgroundColor: '#1259bc',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 10,
  },
  folderFront: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: FOLDER_W,
    height: FRONT_H,
    backgroundColor: '#2d88f0',
    borderRadius: 4,
    transformOrigin: 'bottom center',
    shadowColor: '#1560cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  folderShine: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: '55%',
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  // ── Progress ──
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a8d4ff',
    borderRadius: 4,
  },

  // ── Label ──
  label: {
    position: 'absolute',
    bottom: -10,
    color: 'rgba(150,190,255,0.6)',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: 'rgba(99,179,255,0.9)',
  },
});
