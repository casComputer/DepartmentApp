import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Octicons, MaterialIcons } from "@icons";
import { router } from "expo-router";
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

const ICONS_SIZE = 22;

const adminItems = [
    {
        icon: <MaterialCommunityIcons name="account-group-outline" size={ICONS_SIZE} />,
        label: "Manage Teachers",
        sub: "Staff & roles",
        route: "/(admin)/(others)/ManageTeachers",
        accent: "#2f81f7",
    },
    {
        icon: <Octicons name="log" size={ICONS_SIZE} />,
        label: "Work Logs",
        sub: "Activity history",
        route: "/(admin)/(others)/WorkLogHistory",
        accent: "#3fb950",
    },
    {
        icon: <MaterialIcons name="currency-rupee" size={ICONS_SIZE} />,
        label: "Manage Fees",
        sub: "Fees & dues",
        route: "/common/fees/Selector",
        accent: "#d29922",
    },
];

const AdminCard = ({ item, index }) => {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 80).springify().damping(14)}
            style={animStyle}
            className="flex-1"
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => { scale.value = withSpring(0.96); }}
                onPressOut={() => { scale.value = withSpring(1); }}
                onPress={() => router.push(item.route as any)}
                className="bg-card rounded-2xl p-4 flex-row items-center gap-3"
                style={{
                    borderWidth: 1,
                    borderColor: "rgba(240,246,252,0.08)",
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                }}
            >
                {/* Icon pill */}
                <View
                    style={{
                        backgroundColor: item.accent + "22",
                        borderRadius: 12,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: item.accent + "44",
                    }}
                >
                    <View style={{ color: item.accent }}>
                        {item.icon}
                    </View>
                </View>

                <View className="flex-1">
                    <Text
                        allowFontScaling={false}
                        className="text-text font-bold text-base"
                    >
                        {item.label}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        className="text-text-secondary text-xs mt-0.5 opacity-70"
                    >
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
    );
};

const AdminOptions = () => {
    return (
        <View className="px-4 mt-8">
            <Animated.Text
                entering={FadeInDown.delay(0).springify()}
                allowFontScaling={false}
                className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3 ml-1"
                style={{ letterSpacing: 2, opacity: 0.6 }}
            >
                Admin
            </Animated.Text>

            <View className="gap-2">
                {adminItems.map((item, i) => (
                    <AdminCard key={item.label} item={item} index={i} />
                ))}
            </View>
        </View>
    );
};

export default AdminOptions;
