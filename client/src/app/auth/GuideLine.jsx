import React, { useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    Dimensions,
    Pressable
} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    Easing
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";

const { height } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedImageBackground =
    Animated.createAnimatedComponent(ImageBackground);

const Section = ({ icon, title, items, delay, accentClass, bulletClass }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(36);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
        );
        translateY.value = withDelay(
            delay,
            withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
        );
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }]
    }));

    return (
        <Animated.View
            style={animStyle}
            className="bg-card border border-border rounded-2xl p-5 mb-4"
        >
            <View className="flex-row items-center mb-3 gap-x-3">
                <View
                    className={`w-10 h-10 rounded-xl items-center justify-center ${accentClass.badge}`}
                >
                    <Text className="text-lg">{icon}</Text>
                </View>
                <Text
                    className={`text-base font-bold tracking-wide ${accentClass.title}`}
                >
                    {title}
                </Text>
            </View>

            <View className={`h-px mb-3 ${accentClass.divider}`} />

            {items.map((item, i) => (
                <View key={i} className="flex-row items-start mb-2.5 gap-x-2.5">
                    <View
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${bulletClass}`}
                    />
                    <Text className="flex-1 text-sm text-text-secondary leading-relaxed">
                        {item}
                    </Text>
                </View>
            ))}
        </Animated.View>
    );
};

const ProceedButton = ({ onPress, enterDelay }) => {
    const scale = useSharedValue(0.88);
    const opacity = useSharedValue(0);
    const pressScale = useSharedValue(1);

    useEffect(() => {
        opacity.value = withDelay(
            enterDelay,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
        );
        scale.value = withDelay(
            enterDelay,
            withSpring(1, { damping: 12, stiffness: 120 })
        );
    }, []);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }]
    }));

    const btnStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pressScale.value }]
    }));

    return (
        <Animated.View style={containerStyle} className="mb-10">
            <AnimatedPressable
                style={btnStyle}
                className="bg-btn rounded-2xl py-4 items-center"
                onPress={onPress}
                onPressIn={() => {
                    pressScale.value = withSpring(0.96, {
                        damping: 14,
                        stiffness: 200
                    });
                }}
                onPressOut={() => {
                    pressScale.value = withSpring(1, {
                        damping: 14,
                        stiffness: 200
                    });
                }}
            >
                <Text className="text-text font-extrabold text-base tracking-wide">
                    I Understand — Create My Account
                </Text>
            </AnimatedPressable>

            <Text className="text-center text-text-secondary text-xs mt-3 leading-relaxed">
                By proceeding, you agree to abide by the institution's{"\n"}
                Acceptable Use Policy and Terms of Service.
            </Text>
        </Animated.View>
    );
};

export default function RegistrationGuidelinesScreen({ navigation }) {
    const bgScale = useSharedValue(1);
    const overlayOpacity = useSharedValue(0);
    const contentOpacity = useSharedValue(0);

    const headerOpacity = useSharedValue(0);
    const headerTranslateY = useSharedValue(-24);
    const roleOpacity = useSharedValue(0);
    const roleScale = useSharedValue(0.95);

    const { userRole } = useLocalSearchParams();

    useEffect(() => {
        bgScale.value = withTiming(1.08, {
            duration: 4000,
            easing: Easing.out(Easing.cubic)
        });

        const timer = setTimeout(() => {
            overlayOpacity.value = withTiming(1, {
                duration: 1500,
                easing: Easing.out(Easing.cubic)
            });

            contentOpacity.value = withTiming(1, {
                duration: 1500,
                easing: Easing.out(Easing.cubic)
            });

            headerOpacity.value = withTiming(1, {
                duration: 1300,
                easing: Easing.out(Easing.cubic)
            });

            headerTranslateY.value = withTiming(0, {
                duration: 1500,
                easing: Easing.out(Easing.cubic)
            });

            roleOpacity.value = withDelay(
                1000,
                withTiming(1, { duration: 1000 })
            );

            roleScale.value = withDelay(
                1000,
                withSpring(1, { damping: 14, stiffness: 120 })
            );
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const bgStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bgScale.value }]
    }));

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value
    }));

    const headerStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
        transform: [{ translateY: headerTranslateY.value }]
    }));

    const roleStyle = useAnimatedStyle(() => ({
        opacity: roleOpacity.value,
        transform: [{ scale: roleScale.value }]
    }));

    const handleContinue = () => {
        router.push({
            pathname: "/auth/Signup",
            params: { userRole }
        });

    };

    return (
        <AnimatedImageBackground
            source={require("@assets/images/college.webp")}
            className="flex-1 bg-primary/70"
            style={[{ minHeight: height }, bgStyle]}
            imageStyle={{ resizeMode: "cover" }}
        >
            <Animated.View
                style={overlayStyle}
                className="absolute inset-0 bg-primary/90"
            />

            <Animated.View style={[{ flex: 1 }, contentStyle]}>
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="px-5 pt-16 pb-5"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={headerStyle}
                        className="items-center mb-7"
                    >
                        <View className="flex-row items-center mb-4 gap-x-2">
                            <Text className="text-3xl">🎓</Text>
                            <Text className="text-lg font-bold text-text-secondary tracking-widest uppercase">
                                DC-Connect
                            </Text>
                        </View>
                        <Text className="text-4xl font-black text-text tracking-tight text-center">
                            Before You Begin
                        </Text>
                        <Text className="text-sm text-text-secondary mt-1.5 text-center leading-5">
                            A few important things to know before creating your
                            account
                        </Text>
                    </Animated.View>

                    {/* ── Username ── */}
                    <Section
                        icon="👤"
                        title="Your Username"
                        delay={200}
                        accentClass={{
                            badge: "bg-btn/20",
                            title: "text-text",
                            divider: "bg-btn/30"
                        }}
                        bulletClass="bg-btn"
                        items={[
                            'Use CamelCase format with your full name — e.g., AdwaithAnandSR for "Adwaith Anand S R".',
                            "Your username is your unique identity on this platform. Choose it with care.",
                            "If that username is already taken, a small variation will be suggested — e.g., adwaithAnandSR.",
                            "Avoid nicknames or short forms; your full name keeps things professional and easily traceable."
                        ]}
                    />

                    {/* ── Password ── */}
                    <Section
                        icon="🔑"
                        title="Choosing a Strong Password"
                        delay={400}
                        accentClass={{
                            badge: "bg-purple-400/20",
                            title: "text-purple-400",
                            divider: "bg-purple-400/30"
                        }}
                        bulletClass="bg-purple-400"
                        items={[
                            "Use at least 12 characters — the longer, the stronger.",
                            "Combine uppercase letters, lowercase letters, numbers, and symbols (e.g., @, #, !).",
                            "Avoid passwords that include your name, date of birth, or common dictionary words.",
                            "Use a trusted password manager to generate and securely store your credentials.",
                            "Never share your password with anyone — including IT staff or administrators."
                        ]}
                    />

                    {/* ── Account Security ── */}
                    <Section
                        icon="🛡️"
                        title="Account Security"
                        delay={600}
                        accentClass={{
                            badge: "bg-emerald-400/20",
                            title: "text-emerald-400",
                            divider: "bg-emerald-400/30"
                        }}
                        bulletClass="bg-emerald-400"
                        items={[
                            "Report any suspicious login activity or unauthorized access to the IT department immediately.",
                            "Your account is linked to your institutional role — misuse may result in suspension or further action.",
                            "Avoid accessing the portal over unsecured or public Wi-Fi networks without a VPN."
                        ]}
                    />

                    {/* ── Responsible Use ── */}
                    <Section
                        icon="⚖️"
                        title="Responsible Use Policy"
                        delay={800}
                        accentClass={{
                            badge: "bg-orange-400/20",
                            title: "text-orange-400",
                            divider: "bg-orange-400/30"
                        }}
                        bulletClass="bg-orange-400"
                        items={[
                            "This platform is exclusively for academic and official institutional activities.",
                            "Accessing, sharing, or tampering with another user's data is a serious policy violation.",
                            "All user activity is logged and may be audited for security and compliance purposes.",
                            "Students, teachers, and parents are granted role-based access — do not attempt to exceed your permissions.",
                            "Policy violations may be referred to the institution's disciplinary committee."
                        ]}
                    />

                    <Animated.View
                        style={roleStyle}
                        className="bg-card-selected border border-border rounded-2xl p-5 mb-5"
                    >
                        <Text className="text-base font-bold text-text mb-2">
                            🧑‍🎓 Who Can Register?
                        </Text>
                        <Text className="text-sm text-text-secondary leading-relaxed">
                            Students, Teachers, and Parents of the institution.
                        </Text>
                    </Animated.View>

                    <ProceedButton onPress={handleContinue} enterDelay={1200} />
                </ScrollView>
            </Animated.View>
        </AnimatedImageBackground>
    );
}
