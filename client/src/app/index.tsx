import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import Header from "../components/auth/IndexHeader.tsx";
import Middle from "../components/auth/IndexMiddle.jsx";

export default function Index() {
    return (
        <View className="flex-1 bg-white dark:bg-black">
            {/* BACKGROUND */}
            <LinearGradient
                colors={[
                    "rgba(46,217,177,0.6)",
                    "transparent",
                    ]}
                className="w-full h-44 absolute top-0 left-0"
            />

            {/* HEADER */}
            <Header />

            {/* MIDDLE */}
            <Middle />

            {/* FOOTER */}
            <View className="flex-1 items-center justify-end py-20">
                <Text className="text-2xl text-zinc-900 font-bold text-center mt-8 dark:text-white">
                    Already Have An Account ?
                </Text>
                <TouchableOpacity onPress={() => router.push("auth/Signin")}>
                    <Text className="text-4xl text-blue-400 font-bold text-center mt-2">
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
