import { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    Pressable
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    withSequence,
    withRepeat,
    useAnimatedProps,
    Easing,
    FadeIn,
    FadeInDown
} from "react-native-reanimated";

import Header from "@components/common/Header2.jsx";
import Loader from "@components/common/Loader";
import { fetchAllTeachers } from "@controller/student/teachers.controller.js";
import { useAppStore } from "@store/app.store.js";
import { openPhone, openWhatsApp, openEmail } from "@utils/openApp.js";

const { width: vw } = Dimensions.get("window");

// ─── Animated image with fade-in ─────────────────────────────────────────────
const AnimatedImage = ({ uri }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <View style={{ width: "100%", height: "100%" }}>
            {!loaded && (
                <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: 999
                    }}
                    className="bg-border"
                />
            )}
            <Animated.Image
                source={{ uri }}
                style={{
                    width: "100%",
                    height: "100%",
                    opacity: loaded ? 1 : 0
                }}
                resizeMode="cover"
                onLoad={() => setLoaded(true)}
                entering={FadeIn.duration(400)}
            />
        </View>
    );
};

// ─── Press-scale button ───────────────────────────────────────────────────────
const IconButton = ({ onPress, children, className: cls, style }) => {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));
    return (
        <Animated.View style={[animStyle, style]}>
            <Pressable
                onPress={onPress}
                onPressIn={() => {
                    scale.value = withSpring(0.88, {
                        damping: 10,
                        stiffness: 300
                    });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, {
                        damping: 10,
                        stiffness: 300
                    });
                }}
                className={`w-11 h-11 rounded-2xl bg-card-selected items-center justify-center border border-border ${cls ?? ""}`}
            >
                {children}
            </Pressable>
        </Animated.View>
    );
};

// ─── Course tag ───────────────────────────────────────────────────────────────
const CourseTag = ({ label, highlight }) => (
    <View
        className={`flex-row items-center gap-2 px-3 py-2 rounded-xl ${highlight ? "bg-btn/20" : "bg-card-selected"}`}
    >
        <View
            className={`w-1.5 h-1.5 rounded-full ${highlight ? "bg-btn" : "bg-border"}`}
        />
        <Text
            numberOfLines={1}
            className={`text-sm font-semibold flex-1 ${highlight ? "text-btn" : "text-text-secondary"}`}
        >
            {label}
        </Text>
    </View>
);

// ─── Teacher card ─────────────────────────────────────────────────────────────
const TeacherItem = ({ item }) => {
    const fullname = useAppStore(state => state.user.fullname);
    const students = useAppStore(state => state.user.students);

    const studentText =
        students.length === 1
            ? students[0]
            : students.slice(0, -1).join(", ") + " and " + students.at(-1);

    const message = `*Hi ${item.fullname} 👋*\n\nI'm reaching out regarding *${studentText}*.\n\nJust wanted to ask about (message)\n\n*Thanks in advance 🤝.*`;

    return (
        <Animated.View
            entering={FadeInDown.duration(400).springify().damping(18)}
            className="mx-3 my-2.5"
        >
            <View className="bg-card border border-border rounded-3xl overflow-hidden">
                {/* ── Banner ── */}
                <View className="bg-card-selected h-24 w-full" />

                {/* ── Avatar ── */}
                <View className="items-center" style={{ marginTop: -52 }}>
                    <View
                        style={{
                            width: 108,
                            height: 108,
                            borderRadius: 54,
                            borderWidth: 3
                        }}
                        className="overflow-hidden border-card bg-card-selected"
                    >
                        {item?.dp ? (
                            <AnimatedImage uri={item.dp} />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text
                                    style={{ fontSize: vw * 0.14 }}
                                    className="text-text font-black"
                                >
                                    {item.fullname[0]}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* ── Identity ── */}
                <View className="items-center px-5 mt-3 gap-0.5">
                    <Text className="text-text-secondary text-xs font-bold tracking-widest uppercase">
                        @{item.teacherId}
                    </Text>
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        className="text-text text-2xl font-black text-center"
                    >
                        {item.fullname}
                    </Text>
                    {item.inCharge && (
                        <View className="flex-row items-center gap-1.5 mt-1">
                            <Feather name="briefcase" size={11} color="#888" />
                            <Text className="text-text-secondary text-xs font-semibold">
                                In Charge · {item.inCharge.year}{" "}
                                {item.inCharge.course}
                            </Text>
                        </View>
                    )}
                </View>

                {/* ── Divider ── */}
                <View className="mx-5 my-4 h-px bg-border opacity-60" />

                {/* ── Courses ── */}
                {!!item.courses?.length && (
                    <View className="mx-4 gap-1.5 mb-4">
                        <Text className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-1 px-1">
                            Courses
                        </Text>
                        {item.courses.map((c, i) => {
                            return (
                                <CourseTag
                                    key={i}
                                    label={`${c.year} ${c.course} — ${c.course_name}`}
                                />
                            );
                        })}
                    </View>
                )}

                {/* ── Contact ── */}
                {(item.email || item.phone) && (
                    <View className="mx-4 mb-5 gap-2.5">
                        <View className="h-px bg-border opacity-40" />

                        {item.email && (
                            <TouchableOpacity
                                onPress={() => openEmail(item.email)}
                                className="flex-row items-center gap-2.5 bg-card-selected border border-border rounded-2xl px-4 py-3"
                            >
                                <Feather
                                    name="mail"
                                    size={14}
                                    color="#60a5fa"
                                />
                                <Text
                                    numberOfLines={1}
                                    className="text-blue-400 font-semibold text-sm flex-1"
                                >
                                    {item.email}
                                </Text>
                                <Feather
                                    name="arrow-up-right"
                                    size={13}
                                    color="#60a5fa"
                                />
                            </TouchableOpacity>
                        )}

                        {item.phone && (
                            <View className="flex-row items-center gap-2">
                                <IconButton
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                    className="flex-1 flex-row items-center justify-start px-3 gap-2"
                                    onPress={() => openPhone(item.phone)}
                                >
                                    <MaterialIcons
                                        name="call"
                                        size={18}
                                        color="#60a5fa"
                                    />
                                    <Text
                                        numberOfLines={1}
                                        className="text-text font-semibold text-sm"
                                    >
                                        {item.phone}
                                    </Text>
                                </IconButton>

                                <IconButton
                                    onPress={() =>
                                        openWhatsApp(item.phone, message)
                                    }
                                >
                                    <FontAwesome
                                        name="whatsapp"
                                        size={18}
                                        color="#4ade80"
                                    />
                                </IconButton>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

// ─── Empty / loading state ────────────────────────────────────────────────────
const EmptyState = ({ isLoading }) => (
    <View className="flex-1 items-center justify-center py-20 gap-3">
        {isLoading ? (
            <Loader size="large" />
        ) : (
            <>
                <Text style={{ fontSize: 40 }}>🏫</Text>
                <Text className="text-text font-bold text-lg">
                    No teachers yet
                </Text>
                <Text className="text-text-secondary text-sm">
                    Check back later
                </Text>
            </>
        )}
    </View>
);

// ─── Root ─────────────────────────────────────────────────────────────────────
const TeachersList = () => {
    const {
        data: teachers,
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ["teachers"],
        queryFn: fetchAllTeachers
    });

    return (
        <View className="flex-1 bg-primary">
            <Header />
            <FlashList
                data={teachers}
                renderItem={({ item }) => <TeacherItem item={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.teacherId}
                estimatedItemSize={420}
                ListEmptyComponent={<EmptyState isLoading={isLoading} />}
                onRefresh={refetch}
                refreshing={isRefetching}
                contentContainerStyle={{ paddingVertical: 8 }}
            />
        </View>
    );
};

export default TeachersList;
