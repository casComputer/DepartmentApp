import React, { useEffect, useState } from "react";
import { View, Dimensions, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    Extrapolate,
    runOnJS
} from "react-native-reanimated";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView
} from "react-native-gesture-handler";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function ImageFullView() {
    const { url } = useLocalSearchParams();

    const [ratio, setRatio] = useState(1);

    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);

    // Get real image size
    useEffect(() => {
        if (url) {
            Image.getSize(url, (w, h) => {
                setRatio(w / h);
            });
        }
    }, [url]);

    // Pinch Gesture
    const pinch = Gesture.Pinch()
        .onUpdate(e => {
            scale.value = e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withTiming(1);
            }
        });

    // Drag Gesture (Dismiss)
    const pan = Gesture.Pan()
        .onUpdate(e => {
            if (scale.value === 1) {
                translateY.value = e.translationY;
                translateX.value = e.translationX;
            }
        })
        .onEnd(() => {
            if (translateY.value > 150 && scale.value === 1) {
                runOnJS(router.back)();
            } else {
                translateY.value = withTiming(0);
                translateX.value = withTiming(0);
            }
        });

    const composed = Gesture.Simultaneous(pinch, pan);

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ]
    }));

    return (
        <GestureHandlerRootView className="bg-primary flex-1">
            <Animated.View
                style={[
                    {
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: "black"
                    }
                ]}
            />

            <GestureDetector gesture={composed}>
                <AnimatedImage
                    sharedTransitionTag="sharedTag"
                    source={{ uri: url }}
                    resizeMode="contain"
                    style={[
                        {
                            width: SCREEN_WIDTH,
                            height: SCREEN_WIDTH / ratio,
                            alignSelf: "center",
                            marginTop: SCREEN_HEIGHT / 5
                        },
                        animatedImageStyle
                    ]}
                />
            </GestureDetector>
        </GestureHandlerRootView>
    );
}
