import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle
} from "react-native-reanimated";

const AnimatedCheckbox = ({
    checked,
    onChange,
    size = 25,
    activeBgColor = "rgb(241,36,147)",
    inactiveBgColor = "white",
    activeBorderColor = "white",
    inactiveBorderColor = "#21212199",
    checkmarkColor = "white"
}) => {
    const fill = useSharedValue(checked ? 1 : 0);

    useEffect(() => {
        fill.value = withSpring(checked ? 1 : 0, {
            damping: 12,
            stiffness: 150
        });
    }, [checked, fill]);

    const bgStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: checked ? activeBgColor : inactiveBgColor,
            borderColor: checked ? activeBorderColor : inactiveBorderColor
        };
    });

    const checkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: fill.value }, { rotate: "-45deg" }],
        opacity: fill.value
    }));

    return (
        <Animated.View>
            <Pressable
                onPress={() => onChange(!checked)}
                style={{
                    width: size,
                    height: size
                }}>
                <Animated.View
                    style={[
                        {
                            flex: 1,
                            borderWidth: 1,
                            borderRadius: 5,
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor: inactiveBorderColor
                        },
                        bgStyle
                    ]}>
                    <Animated.View
                        style={[
                            {
                                width: size * 0.5,
                                height: size * 0.25,
                                borderLeftWidth: 3,
                                borderBottomWidth: 3,
                                borderColor: checkmarkColor
                            },
                            checkStyle
                        ]}
                    />
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

export default AnimatedCheckbox;
