import { ScrollView, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import {
    CloudinaryStats,
    TursoStats,
    UsersStats
} from "@components/admin/Stats.jsx";

const Dashboard = () => {
    const handleClick = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        router.push("/(admin)/(others)/AdvancedSystemOperations");
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-primary pt-5 px-2"
            showsVerticalScrollIndicator={false}
        >
            <CloudinaryStats />
            <TursoStats />
            <UsersStats />
            <TouchableOpacity
                onPress={handleClick}
                className="py-5 px-5 rounded-3xl bg-btn my-5 self-center"
            >
                <Text className="text-xl font-black text-text">
                    Advanced System Operations
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Dashboard;
