import {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate
} from "react-native-reanimated";

export const useApplePressAnimation = () => {
    const scale = useSharedValue(1);

    const onPressIn = () => {
        scale.value = withSpring(0.96, {
            damping: 18,
            stiffness: 250
        });
    };

    const onPressOut = () => {
        scale.value = withSpring(1, {
            damping: 18,
            stiffness: 220
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: interpolate(scale.value, [0.96, 1], [0.92, 1]),
        elevation: interpolate(scale.value, [0.96, 1], [8, 2]),
        shadowOpacity: interpolate(scale.value, [0.96, 1], [0.35, 0.15])
    }));

    return { animatedStyle, onPressIn, onPressOut };
};
