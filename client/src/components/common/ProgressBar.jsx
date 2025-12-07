import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";

export default function ProgressBar({ progress }) {
    const animatedProgress = useSharedValue(0);

    React.useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 250 });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedProgress.value * 100}%`
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.bar, animatedStyle]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 8,
        // backgroundColor: "#E0E0E0",
        borderRadius: 4,
        overflow: "hidden"
    },
    bar: {
        height: "100%",
        backgroundColor: "#4CAF50",
        borderRadius: 4
    }
});
