import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { router } from "expo-router";

import Header from "@components/auth/IndexHeader";
import Middle from "@components/auth/IndexMiddle.jsx";

export default function Index() {
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical
            bounces
            overScrollMode="always"
            className="bg-primary"
        >
                <Header />

                {/* MIDDLE */}
                <Middle />

                {/* FOOTER */}
                <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-lg text-text/700 font-bold text-center mt-8">
                        Already Have An Account
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/auth/Signin")}
                    >
                        <Text className="text-3xl text-blue-400 font-bold text-center">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
        </ScrollView>
    );
}
