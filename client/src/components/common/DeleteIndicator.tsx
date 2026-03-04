import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
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
    interpolateColor
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const COLORS = {
    fetch: "#4F6EF7",
    history: "#22D3A5",
    delete: "#F74F4F"
};

const DeleteIndicator = ({ size = 40, color = COLORS.delete }) => {
    const rotation = useSharedValue(0);
    const pulse = useSharedValue(1);
    const opacity = useSharedValue(1);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 700, easing: Easing.linear }),
            -1
        );
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
        transform: [{ rotate: `${rotation.value}deg` }]
    }));

    const pulseRingAnim = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: opacity.value
    }));

    const arcProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * 0.3 // fixed gap — danger arc
    }));

    return (
        <View
            style={{
                width: size,
                height: size,
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            {/* Pulsing outer ring */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        borderRadius: size / 2,
                        borderWidth: strokeWidth * 0.6,
                        borderColor: color
                    },
                    pulseRingAnim
                ]}
            />
            {/* Spinning dashed arc */}
            <Animated.View
                style={[
                    { width: size, height: size, position: "absolute" },
                    spinAnim
                ]}
            >
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

export default DeleteIndicator;
