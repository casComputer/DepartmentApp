import { useEffect } from "react";
import { Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
    interpolate,
    Extrapolation,
    FlipInXDown,
    StretchInX,
    LightSpeedInLeft,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useResolveClassNames } from "uniwind";

const SelectOption = ({ item, selected, onSelect }) => {
    const scale = useSharedValue(1);
    const progress = useSharedValue(selected ? 1 : 0);
    const styles = useResolveClassNames("bg-card-selected");

    useEffect(() => {
        progress.value = withTiming(selected ? 1 : 0, { duration: 250 });
    }, [selected]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            ["transparent", styles.backgroundColor]
        )
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.93, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(item);
    };

    return (
        <TouchableWithoutFeedback
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="w-[50%]"
        >
            <Animated.View className="px-4 py-5 rounded-full" style={animatedStyle}>
                <Text className="text-xl font-bold capitalize text-text">
                    {item.title}
                </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const Select = ({ title, options, select, selected }) => {
    return (
        <Animated.View
            entering={StretchInX.springify().mass(0.4).damping(14).stiffness(160)}
            className="mt-5 px-2 py-4 bg-card border border-border rounded-3xl"
        >
            {title ? (
                <Animated.Text
                    entering={LightSpeedInLeft.delay(120).springify().mass(0.5).damping(14)}
                    className="text-[6vw] px-3 font-bold mb-3 text-text"
                >
                    Select the {title}:
                </Animated.Text>
            ) : null}
            <Animated.View className="w-full flex-row flex-wrap">
                {options.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={
                            FlipInXDown
                                .delay(160 + index * 55)
                                .springify()
                                .mass(0.5)
                                .damping(13)
                                .stiffness(170)
                        }
                        style={{ width: "50%" }}
                    >
                        <SelectOption
                            item={item}
                            selected={selected?.id === item.id}
                            onSelect={select}
                        />
                    </Animated.View>
                ))}
            </Animated.View>
        </Animated.View>
    );
};

export default Select;
