import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const ProgressBar = ({
    width = null,
    height = 10,
    borderRadius = 18,
    bgColor = "rgb(254, 202, 202)",
    fgColor = "rgb(236, 72, 153)",
    progress = 0
}) => {
    let [currentWidth, setCurrentWidth] = useState(0);

    const innerWidth = useSharedValue(0);

    useEffect(() => {
        innerWidth.value = withTiming(currentWidth * progress, {
            duration: 500
        });
    }, [currentWidth, progress]);

    return (
        <View
            style={{
                width: width !== null ? width : "100%",
                height: height,
                borderRadius: borderRadius,
                backgroundColor: bgColor,
                overflow: "hidden"
            }}
            onLayout={e => {
                const width = e.nativeEvent.layout.width;
                setCurrentWidth(width);
            }}
        >
            <Animated.View
                style={{
                    backgroundColor: fgColor,
                    height: "100%",
                    borderRadius,
                    width: innerWidth
                }}
            />
        </View>
    );
};

export default ProgressBar;
