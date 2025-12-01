import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import Header from "../components/auth/IndexHeader";
import Middle from "../components/auth/IndexMiddle.jsx";

import { useThemeStore } from "@store/app.store.js";

const secondaryGradientColors =
    useThemeStore.getState().secondaryGradientColors;

export default function Index() {
    return (
        <LinearGradient colors={secondaryGradientColors} className="flex-1">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                alwaysBounceVertical
                bounces
                overScrollMode="always"
                className=" dark:bg-black">
                {/* BACKGROUND */}
                <Header />

                {/* MIDDLE */}
                <Middle />

                {/* FOOTER */}
                <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-lg text-zinc-900 font-bold text-center mt-8 dark:text-white">
                        Already Have An Account ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/auth/Signin")}>
                        <Text className="text-3xl text-blue-400 font-bold text-center">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}
