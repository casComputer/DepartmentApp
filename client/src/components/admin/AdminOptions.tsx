import { View, Text, TouchableOpacity } from "react-native";
import {
    MaterialCommunityIcons,
    Octicons,
    MaterialIcons,
    Entypo
} from "@icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useApplePressAnimation } from "../../hooks/useAppleAnimation.js";

const ICONS_SIZE = 22;

const adminItems = [
    {
        icon: (
            <MaterialCommunityIcons
                name="account-group-outline"
                size={ICONS_SIZE}
            />
        ),
        label: "Manage Teachers",
        sub: "Staff & roles",
        route: "/(admin)/(others)/ManageTeachers",
        accent: "#2f81f7"
    },
    {
        icon: <Octicons name="log" size={ICONS_SIZE} />,
        label: "Work Logs",
        sub: "Activity history",
        route: "/(admin)/(others)/WorkLogHistory",
        accent: "#3fb950"
    },
    {
        icon: <Entypo name="megaphone" size={ICONS_SIZE} />,
        label: "Notice",
        sub: "Manage Notice",
        route: "/common/notice/History",
        accent: "#f62c77"
    }
];

const AdminCard = ({ item, index }) => {
    const { animatedStyle, onPressIn, onPressOut } = useApplePressAnimation();

    return (
        <View>
            <Animated.View style={animatedStyle}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={() => router.push(item.route)}
                    className="bg-card rounded-2xl p-4 flex-row items-center gap-3 border border-border">
                    <View
                        style={{
                            backgroundColor: item.accent + "22",
                            borderRadius: 12,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: item.accent + "44"
                        }}>
                        <View style={{ color: item.accent }}>{item.icon}</View>
                    </View>

                    <View className="flex-1">
                        <Text className="text-text font-bold text-base">
                            {item.label}
                        </Text>
                        <Text className="text-text-secondary text-xs opacity-70">
                            {item.sub}
                        </Text>
                    </View>

                    <MaterialIcons
                        name="chevron-right"
                        size={18}
                        style={{ opacity: 0.3 }}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const AdminOptions = () => {
    return (
        <View className="px-4 mt-8">
            <Animated.View entering={FadeInDown.springify()}>
                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3 ml-1 opacity-60">
                    Admin
                </Text>
            </Animated.View>

            <View className="gap-2">
                {adminItems.map((item, i) => (
                    <AdminCard key={item.label} item={item} index={i} />
                ))}
            </View>
        </View>
    );
};

export default AdminOptions;
