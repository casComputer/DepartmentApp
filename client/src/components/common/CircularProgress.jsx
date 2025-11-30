import React, { useEffect } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedProps
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
    size = 100,
    strokeWidth = 10,
    progress = 83,
    maxProgress = 100,
    showPercentage = true,
    strokeFillColor = "#4F46E5",
    animated = true
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const normalizedProgress = Number(
        Math.min(progress, maxProgress).toFixed(1)
    );
    // Shared value for animation
    const strokeDashoffset = useSharedValue(circumference);

    const theme = useColorScheme();

    useEffect(() => {
        strokeDashoffset.value = animated
            ? withTiming(
                  circumference -
                      (normalizedProgress / maxProgress) * circumference,
                  { duration: 1000 }
              )
            : circumference -
              (normalizedProgress / maxProgress) * circumference;
    }, [progress]);

    // Animated props for the circle
    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: strokeDashoffset.value
    }));

    return (
        <View style={styles.container}>
            <Svg width={size + 1} height={size + 1}>
                {/* Background circle */}
                <Circle
                    stroke={theme === "dark" ? "#3a3a3a" : "#e6e6e6"}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <AnimatedCircle
                    stroke={strokeFillColor}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={size / 2}
                    originY={size / 2}
                />
            </Svg>

            <View style={styles.textContainer}>
                <Text style={styles.text} className="text-black dark:text-white">
                    {normalizedProgress}
                    {showPercentage && "%"}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    textContainer: {
        position: "absolute"
    },
    text: {
        fontSize: 20,
        fontWeight: "600",
    }
});

export default CircularProgress;
