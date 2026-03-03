import React, { useCallback, useRef } from "react";
import { Pressable, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    interpolateColor,
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from "react-native-reanimated";

import Svg, { Circle, Line, Polygon } from "react-native-svg";
import { useCSSVariable, useResolveClassNames } from "uniwind";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RollNumberBadgeProps {
    rollno: string | number;
    label?: string;
}

// ─── Animation catalogue ──────────────────────────────────────────────────────
type AnimKey =
    | "jelly"
    | "flip"
    | "shiver"
    | "pop"
    | "tilt"
    | "bounce"
    | "spin"
    | "glitch"
    | "rubberBand"
    | "slam"
    | "heartbeat"
    | "vortex"
    | "fold"
    | "drunk"
    | "matrix"
    | "explosion"
    | "wormhole";

const ANIMS: AnimKey[] = [
    "jelly",
    "flip",
    "shiver",
    "pop",
    "tilt",
    "bounce",
    "spin",
    "glitch",
    "rubberBand",
    "slam",
    "heartbeat",
    "vortex",
    "fold",
    "drunk",
    "matrix",
    "explosion",
    "wormhole"
];

// Module-level cursor so each tap cycles to the next distinct animation
let animCursor = 0;

// ─── Spark particle ───────────────────────────────────────────────────────────

const Spark = ({
    progress,
    angle,
    color
}: {
    progress: Animated.SharedValue<number>;
    angle: number;
    color: string;
}) => {
    const style = useAnimatedStyle(() => {
        const rad = (angle * Math.PI) / 180;
        const dist = interpolate(progress.value, [0, 1], [0, 56]);
        return {
            opacity: interpolate(progress.value, [0, 0.55, 1], [1, 0.9, 0]),
            transform: [
                { translateX: Math.cos(rad) * dist },
                { translateY: Math.sin(rad) * dist },
                { scale: interpolate(progress.value, [0, 0.35, 1], [0, 1, 0]) }
            ]
        };
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                {
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: color
                },
                style
            ]}
        />
    );
};

// ─── Main component ───────────────────────────────────────────────────────────

const RollNumberBadge: React.FC<RollNumberBadgeProps> = ({
    rollno,
    label = "Roll No."
}) => {
    // ── Resolve theme tokens ──────────────────────────────────────────────────
    //
    // useResolveClassNames → style objects for layout / typography / border
    // useCSSVariable       → raw color strings needed by interpolateColor()
    //
    const cardStyle = useResolveClassNames(
        "bg-card border border-border rounded-3xl"
    );
    const labelStyle = useResolveClassNames(
        "text-xs font-semibold tracking-widest uppercase text-text-secondary"
    );
    const rollnoStyle = useResolveClassNames(
        "text-3xl font-bold tracking-widest text-text"
    );
    const hintStyle = useResolveClassNames(
        "text-xs tracking-widest text-text/80"
    );
    const wrapperStyle = useResolveClassNames("items-center justify-center");
    const barStyle = useResolveClassNames(
        "bg-card-selected opacity-30 rounded-sm"
    );

    // Raw color values for Reanimated's interpolateColor (must be hex/rgb strings)
    const [colorCard, colorCardSelected, colorPrimary, colorText] =
        useCSSVariable([
            "--color-card",
            "--color-card-selected",
            "--color-btn",
            "--color-text"
        ]) as string[];

    // ── Shared values (all mutated on the UI thread) ──────────────────────────
    const scale = useSharedValue(1);
    const scaleX = useSharedValue(1);
    const scaleY = useSharedValue(1);
    const rotate = useSharedValue(0);
    const skewX = useSharedValue(0);
    const ty = useSharedValue(0);
    const colorProg = useSharedValue(0); // 0 → 1: card flash
    const sparkProg = useSharedValue(0); // 0 → 1: burst
    const tx = useSharedValue(0); // horizontal translate
    const opacity = useSharedValue(1); // card opacity
    const rotateY = useSharedValue(0); // Y-axis perspective degrees
    const scaleZ = useSharedValue(1); // used as perspective punch

    const busy = useRef(false);

    // 8 spark directions; colors sourced from theme primary + fixed accent set
    const SPARK_ANGLES = [-90, -45, 0, 45, 90, 135, 180, -135];
    // We use colorPrimary for every other spark; the rest use fixed accent hues
    // that work across both light and dark themes
    const sparkColors = [
        colorPrimary,
        "#FF6584",
        colorPrimary,
        "#FFD93D",
        colorPrimary,
        "#43CBFF",
        colorPrimary,
        "#6BCB77"
    ];

    // ── Animation worklets ────────────────────────────────────────────────────

    const doJelly = () => {
        "worklet";
        scaleX.value = withSequence(
            withTiming(1.35, { duration: 75 }),
            withTiming(0.72, { duration: 80 }),
            withTiming(1.18, { duration: 65 }),
            withTiming(0.92, { duration: 60 }),
            withSpring(1, { damping: 6 })
        );
        scaleY.value = withSequence(
            withTiming(0.72, { duration: 75 }),
            withTiming(1.28, { duration: 80 }),
            withTiming(0.9, { duration: 65 }),
            withTiming(1.08, { duration: 60 }),
            withSpring(1, { damping: 6 })
        );
    };

    const doFlip = () => {
        "worklet";
        scaleX.value = withSequence(
            withTiming(0, { duration: 140, easing: Easing.in(Easing.quad) }),
            withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) })
        );
        colorProg.value = withSequence(
            withTiming(1, { duration: 140 }),
            withTiming(0, { duration: 320 })
        );
    };

    const doShiver = () => {
        "worklet";
        rotate.value = withSequence(
            withTiming(-9, { duration: 45 }),
            withRepeat(
                withSequence(
                    withTiming(9, { duration: 55 }),
                    withTiming(-9, { duration: 55 })
                ),
                4,
                false
            ),
            withSpring(0, { damping: 12 })
        );
    };

    const doPop = () => {
        "worklet";
        scale.value = withSequence(
            withTiming(1.45, {
                duration: 90,
                easing: Easing.out(Easing.cubic)
            }),
            withSpring(1, { damping: 5, stiffness: 200 })
        );
        sparkProg.value = 0;
        sparkProg.value = withTiming(1, {
            duration: 650,
            easing: Easing.out(Easing.exp)
        });
        colorProg.value = withSequence(
            withTiming(1, { duration: 90 }),
            withTiming(0, { duration: 550 })
        );
    };

    const doTilt = () => {
        "worklet";
        skewX.value = withSequence(
            withTiming(16, { duration: 90 }),
            withTiming(-10, { duration: 110 }),
            withSpring(0, { damping: 10 })
        );
        scale.value = withSequence(
            withTiming(1.06, { duration: 90 }),
            withSpring(1, { damping: 8 })
        );
    };

    const doBounce = () => {
        "worklet";
        ty.value = withSequence(
            withTiming(-26, { duration: 145, easing: Easing.out(Easing.quad) }),
            withTiming(7, { duration: 100, easing: Easing.in(Easing.quad) }),
            withTiming(-10, { duration: 95, easing: Easing.out(Easing.quad) }),
            withSpring(0, { damping: 8 })
        );
        scaleY.value = withSequence(
            withTiming(0.82, { duration: 80 }),
            withTiming(1.12, { duration: 100 }),
            withSpring(1, { damping: 10 })
        );
    };

    const doSpin = () => {
        "worklet";
        rotate.value = withSequence(
            withTiming(360, {
                duration: 420,
                easing: Easing.out(Easing.cubic)
            }),
            withTiming(0, { duration: 0 })
        );
        scale.value = withSequence(
            withTiming(1.18, { duration: 200 }),
            withSpring(1, { damping: 8 })
        );
    };

    const doGlitch = () => {
        "worklet";
        tx.value = withSequence(
            withTiming(-10, { duration: 30 }),
            withTiming(10, { duration: 30 }),
            withTiming(-6, { duration: 25 }),
            withTiming(6, { duration: 25 }),
            withTiming(-3, { duration: 20 }),
            withTiming(3, { duration: 20 }),
            withTiming(0, { duration: 15 })
        );
        scaleX.value = withSequence(
            withTiming(1.04, { duration: 30 }),
            withTiming(0.97, { duration: 30 }),
            withTiming(1.02, { duration: 25 }),
            withTiming(0.99, { duration: 20 }),
            withTiming(1, { duration: 15 })
        );
        colorProg.value = withSequence(
            withTiming(1, { duration: 30 }),
            withTiming(0, { duration: 30 }),
            withTiming(1, { duration: 25 }),
            withTiming(0, { duration: 25 }),
            withTiming(1, { duration: 20 }),
            withTiming(0, { duration: 100 })
        );
    };

    // ── RubberBand: elastic overshoot in all axes like a snapped band ───────────
    const doRubberBand = () => {
        "worklet";
        scaleX.value = withSequence(
            withTiming(1.5, { duration: 100, easing: Easing.out(Easing.quad) }),
            withTiming(0.6, { duration: 100, easing: Easing.in(Easing.quad) }),
            withTiming(1.25, { duration: 80 }),
            withTiming(0.85, { duration: 80 }),
            withTiming(1.1, { duration: 60 }),
            withTiming(0.95, { duration: 60 }),
            withSpring(1, { damping: 10, stiffness: 180 })
        );
        scaleY.value = withSequence(
            withTiming(0.6, { duration: 100, easing: Easing.out(Easing.quad) }),
            withTiming(1.5, { duration: 100, easing: Easing.in(Easing.quad) }),
            withTiming(0.85, { duration: 80 }),
            withTiming(1.25, { duration: 80 }),
            withTiming(0.95, { duration: 60 }),
            withTiming(1.1, { duration: 60 }),
            withSpring(1, { damping: 10, stiffness: 180 })
        );
    };

    // ── Slam: rockets up off-screen then crashes down with ground squash ────────
    const doSlam = () => {
        "worklet";
        ty.value = withSequence(
            withTiming(-80, {
                duration: 120,
                easing: Easing.out(Easing.cubic)
            }),
            withTiming(12, { duration: 80, easing: Easing.in(Easing.bounce) }),
            withTiming(-6, { duration: 50 }),
            withSpring(0, { damping: 6, stiffness: 260 })
        );
        scaleX.value = withSequence(
            withTiming(0.9, { duration: 120 }),
            withTiming(1.35, { duration: 80 }),
            withTiming(0.95, { duration: 50 }),
            withSpring(1, { damping: 8 })
        );
        scaleY.value = withSequence(
            withTiming(1.15, { duration: 120 }),
            withTiming(0.6, { duration: 80 }),
            withTiming(1.1, { duration: 50 }),
            withSpring(1, { damping: 8 })
        );
        colorProg.value = withSequence(
            withTiming(0, { duration: 120 }),
            withTiming(1, { duration: 80 }),
            withTiming(0, { duration: 300 })
        );
    };

    // ── Heartbeat: double-thump like a real cardiac pulse ──────────────────────
    const doHeartbeat = () => {
        "worklet";
        scale.value = withSequence(
            withTiming(1.22, {
                duration: 100,
                easing: Easing.out(Easing.quad)
            }),
            withTiming(1.0, { duration: 80 }),
            withTiming(1.35, {
                duration: 110,
                easing: Easing.out(Easing.quad)
            }),
            withTiming(1.0, { duration: 80 }),
            withSpring(1, { damping: 12, stiffness: 200 })
        );
        colorProg.value = withSequence(
            withTiming(0.6, { duration: 100 }),
            withTiming(0, { duration: 80 }),
            withTiming(1, { duration: 110 }),
            withTiming(0, { duration: 300 })
        );
    };

    // ── Vortex: spirals inward to nothing then explodes back out ───────────────
    const doVortex = () => {
        "worklet";
        rotate.value = withSequence(
            withTiming(270, { duration: 300, easing: Easing.in(Easing.quad) }),
            withTiming(360, { duration: 0 }),
            withTiming(360, { duration: 0 }),
            withTiming(0, { duration: 0 }),
            withTiming(-30, {
                duration: 120,
                easing: Easing.out(Easing.back(3))
            }),
            withSpring(0, { damping: 8 })
        );
        scale.value = withSequence(
            withTiming(0.1, { duration: 300, easing: Easing.in(Easing.quad) }),
            withTiming(1.6, {
                duration: 180,
                easing: Easing.out(Easing.cubic)
            }),
            withSpring(1, { damping: 6, stiffness: 200 })
        );
        sparkProg.value = 0;
        sparkProg.value = withDelay(
            300,
            withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) })
        );
    };

    // ── Fold: card folds flat then unfolds like paper ──────────────────────────
    const doFold = () => {
        "worklet";
        scaleY.value = withSequence(
            withTiming(0.05, {
                duration: 180,
                easing: Easing.in(Easing.cubic)
            }),
            withTiming(1.12, {
                duration: 220,
                easing: Easing.out(Easing.back(2))
            }),
            withSpring(1, { damping: 10 })
        );
        opacity.value = withSequence(
            withTiming(0.3, { duration: 180 }),
            withTiming(1, { duration: 220 })
        );
        colorProg.value = withSequence(
            withTiming(0, { duration: 180 }),
            withTiming(1, { duration: 120 }),
            withTiming(0, { duration: 220 })
        );
    };

    // ── Drunk: wobbly sway like it had too much coffee ─────────────────────────
    const doDrunk = () => {
        "worklet";
        rotate.value = withSequence(
            withTiming(12, { duration: 120 }),
            withTiming(-10, { duration: 120 }),
            withTiming(8, { duration: 100 }),
            withTiming(-6, { duration: 100 }),
            withTiming(4, { duration: 80 }),
            withTiming(-2, { duration: 80 }),
            withSpring(0, { damping: 14 })
        );
        tx.value = withSequence(
            withTiming(10, { duration: 120 }),
            withTiming(-8, { duration: 120 }),
            withTiming(5, { duration: 100 }),
            withTiming(-3, { duration: 100 }),
            withSpring(0, { damping: 12 })
        );
        ty.value = withSequence(
            withTiming(4, { duration: 120 }),
            withTiming(-4, { duration: 120 }),
            withTiming(2, { duration: 100 }),
            withSpring(0, { damping: 12 })
        );
    };

    // ── Matrix: rapid scale flicker like binary rain decoding ──────────────────
    const doMatrix = () => {
        "worklet";
        // 6 rapid scale pulses at alternating sizes — digital decode effect
        scale.value = withSequence(
            withTiming(0.85, { duration: 40 }),
            withTiming(1.12, { duration: 40 }),
            withTiming(0.9, { duration: 35 }),
            withTiming(1.18, { duration: 35 }),
            withTiming(0.88, { duration: 30 }),
            withTiming(1.22, { duration: 30 }),
            withTiming(0.95, { duration: 30 }),
            withSpring(1, { damping: 8, stiffness: 220 })
        );
        colorProg.value = withSequence(
            withTiming(1, { duration: 40 }),
            withTiming(0, { duration: 40 }),
            withTiming(1, { duration: 35 }),
            withTiming(0, { duration: 35 }),
            withTiming(1, { duration: 30 }),
            withTiming(0, { duration: 30 }),
            withTiming(1, { duration: 30 }),
            withTiming(0, { duration: 200 })
        );
        ty.value = withSequence(
            withTiming(-4, { duration: 40 }),
            withTiming(4, { duration: 40 }),
            withTiming(-3, { duration: 35 }),
            withTiming(3, { duration: 35 }),
            withTiming(-2, { duration: 30 }),
            withTiming(2, { duration: 30 }),
            withSpring(0, { damping: 10 })
        );
    };

    // ── Explosion: shatters outward then snaps back to perfect form ────────────
    const doExplosion = () => {
        "worklet";
        scale.value = withSequence(
            withTiming(0.7, { duration: 60, easing: Easing.in(Easing.cubic) }),
            withTiming(1.8, {
                duration: 100,
                easing: Easing.out(Easing.cubic)
            }),
            withTiming(0.9, { duration: 80 }),
            withSpring(1, { damping: 5, stiffness: 180 })
        );
        rotate.value = withSequence(
            withTiming(-15, { duration: 60 }),
            withTiming(10, { duration: 100 }),
            withTiming(-5, { duration: 80 }),
            withSpring(0, { damping: 10 })
        );
        sparkProg.value = 0;
        sparkProg.value = withDelay(
            60,
            withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) })
        );
        colorProg.value = withSequence(
            withTiming(1, { duration: 160 }),
            withTiming(0, { duration: 400 })
        );
    };

    // ── Wormhole: implodes to a singularity then bursts back with a spin ────────
    const doWormhole = () => {
        "worklet";
        scale.value = withSequence(
            withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }),
            withTiming(1.5, {
                duration: 180,
                easing: Easing.out(Easing.cubic)
            }),
            withSpring(1, { damping: 5, stiffness: 160 })
        );
        rotate.value = withSequence(
            withTiming(-180, { duration: 220, easing: Easing.in(Easing.quad) }),
            withTiming(0, { duration: 0 }),
            withTiming(20, {
                duration: 180,
                easing: Easing.out(Easing.back(2))
            }),
            withSpring(0, { damping: 8 })
        );
        opacity.value = withSequence(
            withTiming(0, { duration: 220 }),
            withTiming(1, { duration: 180 })
        );
        sparkProg.value = 0;
        sparkProg.value = withDelay(
            220,
            withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) })
        );
    };

    // ── Press handler ─────────────────────────────────────────────────────────

    const handlePress = useCallback(() => {
        if (busy.current) return;
        busy.current = true;

        const key = ANIMS[animCursor % ANIMS.length];
        animCursor += 1;

        runOnUI(() => {
            "worklet";
            switch (key) {
                case "jelly":
                    doJelly();
                    break;
                case "flip":
                    doFlip();
                    break;
                case "shiver":
                    doShiver();
                    break;
                case "pop":
                    doPop();
                    break;
                case "tilt":
                    doTilt();
                    break;
                case "bounce":
                    doBounce();
                    break;
                case "spin":
                    doSpin();
                    break;
                case "glitch":
                    doGlitch();
                    break;
                case "rubberBand":
                    doRubberBand();
                    break;
                case "slam":
                    doSlam();
                    break;
                case "heartbeat":
                    doHeartbeat();
                    break;
                case "vortex":
                    doVortex();
                    break;
                case "fold":
                    doFold();
                    break;
                case "drunk":
                    doDrunk();
                    break;
                case "matrix":
                    doMatrix();
                    break;
                case "explosion":
                    doExplosion();
                    break;
                case "wormhole":
                    doWormhole();
                    break;
            }
        })();

        setTimeout(() => {
            busy.current = false;
        }, 750);
    }, []);

    // ── Animated styles ───────────────────────────────────────────────────────

    const animWrapStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
            { scaleX: scaleX.value },
            { scaleY: scaleY.value },
            { rotate: `${rotate.value}deg` },
            { skewX: `${skewX.value}deg` },
            { translateY: ty.value },
            { translateX: tx.value }
        ]
    }));
    // Card background flashes to card-selected on certain animations
    const animCardBg = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            colorProg.value,
            [0, 1],
            [colorCard ?? "#fff", colorCardSelected ?? "#e0e7ff"]
        )
    }));

    // Roll number color pulses toward primary on flash animations
    const animTextColor = useAnimatedStyle(() => ({
        color: interpolateColor(
            colorProg.value,
            [0, 1],
            [colorText ?? "#111", colorPrimary ?? "#6366f1"]
        )
    }));

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <View style={wrapperStyle}>
            {/* Spark burst — zero-size layer centered exactly on the badge */}
            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20
                }}
            >
                {SPARK_ANGLES.map((angle, i) => (
                    <Spark
                        key={i}
                        progress={sparkProg}
                        angle={angle}
                        color={sparkColors[i] ?? "#6366f1"}
                    />
                ))}
            </View>

            {/* Badge */}
            <Animated.View style={animWrapStyle}>
                <Pressable onPress={handlePress} android_ripple={null}>
                    <Animated.View
                        style={[
                            cardStyle,
                            animCardBg,
                            {
                                width: 220,
                                paddingVertical: 28,
                                paddingHorizontal: 26,
                                alignItems: "center",
                                overflow: "hidden",
                                // shadow uses primary color for a themed glow
                                shadowColor: colorPrimary ?? "#6366f1",
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.16,
                                shadowRadius: 22,
                                elevation: 10
                            }
                        ]}
                    >
                        {/* Top-left corner accent — tinted with primary */}
                        <View
                            pointerEvents="none"
                            style={{ position: "absolute", top: 0, left: 0 }}
                        >
                            <Svg width={42} height={42}>
                                <Polygon
                                    points="0,0 42,0 0,42"
                                    fill={colorPrimary ?? "#6366f1"}
                                    opacity={0.1}
                                />

                            </Svg>
                        </View>

                        {/* Bottom-right corner accent */}
                        <View
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0
                            }}
                        >
                            <Svg width={42} height={42}>
                                <Polygon
                                    points="42,42 0,42 42,0"
                                    fill={colorPrimary ?? "#6366f1"}
                                    opacity={0.07}
                                />
                            </Svg>
                        </View>

                        {/* Decorative dot row */}
                        <View style={{ marginBottom: 14 }} pointerEvents="none">
                            <Svg width={64} height={10}>
                                {[0, 16, 32, 48].map((x, i) => (
                                    <Circle
                                        key={i}
                                        cx={x + 5}
                                        cy={5}
                                        r={3.5}
                                        fill={labelStyle.color ?? "#6366f1"}
                                        opacity={0.12 + i * 0.09}
                                    />
                                ))}
                            </Svg>
                        </View>

                        {/* Label */}
                        <Animated.Text style={labelStyle}>
                            {label}
                        </Animated.Text>

                        {/* Roll number — color animates on flash */}
                        <Animated.Text
                            style={[
                                rollnoStyle,
                                animTextColor,
                                { marginTop: 6 }
                            ]}
                        >
                            {rollno}
                        </Animated.Text>

                        {/* Underline bar */}
                        <View
                            style={[
                                barStyle,
                                { marginTop: 14, width: 44, height: 3 }
                            ]}
                        />

                        {/* Tap hint */}
                        <Animated.Text style={[hintStyle, { marginTop: 16 }]}>
                            tap me ✦
                        </Animated.Text>
                    </Animated.View>
                </Pressable>
            </Animated.View>
        </View>
    );
};

export default RollNumberBadge;
