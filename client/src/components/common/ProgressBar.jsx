import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from "react-native-reanimated";

const ProgressBar = ({
    width = null,
    height = 10,
    borderRadius = 18,
    bgColor = "rgb(254, 202, 202)",
    fgColor = "rgb(236, 72, 153)",
    progress = 0,
}) => {
    const [currentWidth, setCurrentWidth] = useState(0);
    const innerWidth = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        width: innerWidth.value,
    }));

    useEffect(() => {
        const safeProgress = Math.max(0, Math.min(progress, 1));
        innerWidth.value = withTiming(currentWidth * safeProgress, {
            duration: 500,
        });
    }, [currentWidth, progress]);

    return (
        <View
            style={{
                width,
                height,
                borderRadius,
                backgroundColor: bgColor,
                overflow: "hidden",
            }}
            // className="bg-color-secondary"
            onLayout={(e) => setCurrentWidth(e.nativeEvent.layout.width)}
        >
            <Animated.View
                style={[
                    {
                        // backgroundColor: fgColor,
                        height: "100%",
                        borderRadius,
                    },
                    animatedStyle,
                ]}
                className="bg-btn"
            />
        </View>
    );
};

export default ProgressBar;
