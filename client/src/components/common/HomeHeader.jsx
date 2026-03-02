import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@icons";
import { router } from "expo-router";
import Animated, {
    FadeIn,
    FlipInXDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";

const Header = () => {
    const pressed = useSharedValue(0);

    const bellStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(pressed.value, [0, 0.5, 1], [1, 0.85, 1], Extrapolation.CLAMP) },
        ],
    }));

    return (
        <View className="flex-row items-center justify-between px-5 pt-5 pb-2">
            <Animated.Text
                entering={FlipInXDown.springify().mass(0.5).damping(14).stiffness(160)}
                allowFontScaling={false}
                className="text-5xl font-black text-text-secondary"
                style={{ letterSpacing: -1.5 }}
            >
                DC-Connect
            </Animated.Text>

            <Animated.View entering={FadeIn.delay(200).duration(300)}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={() => pressed.value = withSpring(1, { damping: 12, stiffness: 300 })}
                    onPressOut={() => pressed.value = withSpring(0, { damping: 10, stiffness: 200 })}
                    onPress={() => router.push("/common/notification/NotificationList")}
                >
                    <Animated.View
                        style={[
                            bellStyle,
                            {
                                width: 42,
                                height: 42,
                                borderRadius: 13,
                                backgroundColor: "rgba(240,246,252,0.06)",
                                borderWidth: 1,
                                borderColor: "rgba(240,246,252,0.08)",
                                alignItems: "center",
                                justifyContent: "center",
                            }
                        ]}
                    >
                        <Ionicons name="notifications" size={20} color="rgba(230,237,243,0.75)" />
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default Header;
