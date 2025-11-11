import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CircularProgress = ({
    size = 100,
    strokeWidth = 10,
    progress = 83,
    maxProgress = 100,
    showPercentage = true,
    strokeFillColor = "#4F46E5", 

}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const normalizedProgress = Math.min(progress, maxProgress);
    const strokeDashoffset =
        circumference - (normalizedProgress / maxProgress) * circumference;

    return (
        <View className="justify-center items-center ">
            <Svg width={size} height={size}>
                {/* Background circle */}
                <Circle
                    stroke={'#e6e6e6'}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <Circle
                    stroke={strokeFillColor}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    originX={size / 2}
                    originY={size / 2}
                />
            </Svg>

            <View style={styles.textContainer}>
                <Text style={styles.text}>
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
        alignItems: "center"
    },
    textContainer: {
        position: "absolute"
    },
    text: {
        fontSize: 20,
        fontWeight: "600",
        color: "#4F46E5"
    }
});

export default CircularProgress;
