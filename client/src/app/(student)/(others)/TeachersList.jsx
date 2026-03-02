import { useEffect, useState } from "react";
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    FadeIn,
} from "react-native-reanimated";

import Header from "@components/common/Header2.jsx";
import { fetchAllTeachers } from "@controller/student/teachers.controller.js";
import { useAppStore } from "@store/app.store.js";
import { openPhone, openWhatsApp, openEmail } from "@utils/openApp.js";

const { width: vw } = Dimensions.get("window");
const CARD_WIDTH = vw * 0.78;

// ─── Shimmer — only used in skeleton, not inside real list items ──────────────
const Shimmer = ({ style }) => {
    const opacity = useSharedValue(1);
    useEffect(() => {
        opacity.value = withRepeat(withTiming(0.3, { duration: 850 }), -1, true);
    }, []);
    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
    return <Animated.View style={[animStyle, style]} className="bg-border" />;
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const TeacherCardSkeleton = () => (
    <View
        style={{ width: CARD_WIDTH, marginHorizontal: 8 }}
        className="bg-card border border-border my-2 rounded-3xl overflow-hidden"
    >
        <View className="bg-card-selected items-center pt-6 pb-10">
            <Shimmer style={{ width: 96, height: 96, borderRadius: 48 }} />
        </View>
        <View className="items-center -mt-6 px-4">
            <View className="bg-card border border-border rounded-2xl px-4 py-3 items-center w-full gap-2">
                <Shimmer style={{ width: 80, height: 10, borderRadius: 5 }} />
                <Shimmer style={{ width: 150, height: 22, borderRadius: 8 }} />
                <Shimmer style={{ width: 110, height: 10, borderRadius: 5 }} />
            </View>
        </View>
        <View className="mx-4 mt-3 bg-card-selected rounded-2xl px-3 py-3 gap-2">
            <Shimmer style={{ width: "85%", height: 12, borderRadius: 6 }} />
            <Shimmer style={{ width: "65%", height: 12, borderRadius: 6 }} />
        </View>
        <View className="px-4 pt-3 pb-4 gap-2">
            <Shimmer style={{ height: 36, borderRadius: 16 }} />
            <View className="flex-row gap-2">
                <Shimmer style={{ flex: 1, height: 36, borderRadius: 16 }} />
                <Shimmer style={{ flex: 1, height: 36, borderRadius: 16 }} />
            </View>
        </View>
    </View>
);

// ─── Image with fade-in on load ───────────────────────────────────────────────
const AnimatedImage = ({ uri }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <View className="w-full h-full rounded-full items-center justify-center">
            {!loaded && (
                <View
                    style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 999 }}
                    className="bg-border"
                />
            )}
            <Animated.Image
                source={{ uri }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
                onLoad={() => setLoaded(true)}
                entering={FadeIn.duration(300)}
                style={{ opacity: loaded ? 1 : 0 }}
            />
        </View>
    );
};

// ─── Contact button ───────────────────────────────────────────────────────────
const ContactButton = ({ onPress, icon, label, color, bg }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{ backgroundColor: bg }}
        className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-2xl"
    >
        {icon}
        <Text style={{ color }} className="text-xs font-bold">{label}</Text>
    </TouchableOpacity>
);

// ─── Teacher card ─────────────────────────────────────────────────────────────
const TeacherItem = ({ item, course, year }) => (
    <View
        style={{ width: CARD_WIDTH, marginHorizontal: 8 }}
        className="bg-card border border-border my-2 rounded-3xl overflow-hidden"
    >
        <View className="bg-card-selected items-center pt-6 pb-10">
            <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-card bg-card items-center justify-center">
                {item?.dp ? (
                    <AnimatedImage uri={item.dp} />
                ) : (
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={{ fontSize: vw * 0.13 }}
                        className="text-text font-black px-3 text-center w-full"
                    >
                        {item.fullname[0]}
                    </Text>
                )}
            </View>
        </View>

        <View className="items-center -mt-6 px-4">
            <View className="bg-card border border-border rounded-2xl px-4 py-2 items-center w-full">
                <Text className="text-text/50 text-xs font-semibold tracking-widest uppercase">
                    @{item.teacherId}
                </Text>
                <Text numberOfLines={1} adjustsFontSizeToFit className="text-text font-black text-2xl text-center">
                    {item.fullname}
                </Text>
                {item.inCharge && (
                    <View className="flex-row items-center gap-1 mt-0.5">
                        <Feather name="briefcase" size={11} color="#888" />
                        <Text className="text-text/50 text-xs font-semibold">
                            In Charge · {item.inCharge.year} {item.inCharge.course}
                        </Text>
                    </View>
                )}
            </View>
        </View>

        {!!item.courses?.length && (
            <View className="mx-4 mt-3 bg-card-selected rounded-2xl px-3 py-2 gap-1">
                {item.courses.map((c, i) => {
                    const isMatch = c.course === course && c.year === year;
                    return (
                        <View
                            key={i}
                            className={`flex-row items-center gap-2 px-2 py-1 rounded-xl ${isMatch ? "bg-primary/30" : ""}`}
                        >
                            <View className={`w-1.5 h-1.5 rounded-full ${isMatch ? "bg-text-secondary" : "bg-text/30"}`} />
                            <Text numberOfLines={1} className={`text-sm font-bold flex-1 ${isMatch ? "text-text-secondary" : "text-text/70"}`}>
                                {c.year} {c.course} — {c.course_name}
                            </Text>
                        </View>
                    );
                })}
            </View>
        )}

        {(item.email || item.phone) && (
            <View className="px-4 pt-3 pb-4 gap-2">
                {item.email && (
                    <TouchableOpacity
                        onPress={() => openEmail(item.email)}
                        className="flex-row items-center gap-2 bg-card-selected px-3 py-2 rounded-2xl"
                    >
                        <Feather name="mail" size={14} color="#888" />
                        <Text className="text-blue-400 font-semibold text-xs flex-1" numberOfLines={1}>
                            {item.email}
                        </Text>
                    </TouchableOpacity>
                )}
                {item.phone && (
                    <View className="flex-row gap-2">
                        <ContactButton
                            onPress={() => openPhone(item.phone)}
                            icon={<MaterialIcons name="call" size={14} color="#60a5fa" />}
                            label={item.phone}
                            color="#60a5fa"
                            bg="rgba(59,130,246,0.1)"
                        />
                        <ContactButton
                            onPress={() => openWhatsApp(item.phone, `Hai *${item.fullname}* 👋\n`)}
                            icon={<FontAwesome name="whatsapp" size={14} color="#4ade80" />}
                            label="WhatsApp"
                            color="#4ade80"
                            bg="rgba(34,197,94,0.1)"
                        />
                    </View>
                )}
            </View>
        )}
    </View>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title }) => (
    <View className="flex-row items-center gap-3 mt-5 mb-1 px-4">
        <Text className="text-text text-xl font-black">{title}</Text>
        <View className="flex-1 h-px bg-border" />
    </View>
);

// ─── Horizontal section rendered as a FlashList item ─────────────────────────
// The outer vertical FlashList renders section headers + horizontal FlashLists
// as plain items — no ScrollView wrapper needed.
const HorizontalSection = ({ title, teachers, course, year, skeletonCount = 2 }) => (
    <View>
        <SectionHeader title={title} />
        <FlashList
            data={teachers}
            renderItem={({ item }) => (
                <TeacherItem item={item} course={course} year={year} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.teacherId}
            contentContainerStyle={{
                paddingHorizontal: teachers.length === 1 ? (vw - CARD_WIDTH) / 2 - 8 : 8,
            }}
            estimatedItemSize={CARD_WIDTH}
        />
    </View>
);

// ─── Skeleton section ─────────────────────────────────────────────────────────
const SkeletonSection = ({ title }) => (
    <View>
        <View className="flex-row items-center gap-3 mt-5 mb-1 px-4">
            <Shimmer style={{ width: 130, height: 20, borderRadius: 8 }} />
            <View className="flex-1 h-px bg-border opacity-40" />
        </View>
        <FlashList
            data={[1, 2]}
            renderItem={() => <TeacherCardSkeleton />}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => String(i)}
            estimatedItemSize={CARD_WIDTH}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            scrollEnabled={false}
        />
    </View>
);

// ─── Root ─────────────────────────────────────────────────────────────────────
const TeachersList = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["teachers"],
        queryFn: fetchAllTeachers,
    });

    const course = useAppStore(state => state.user.course);
    const year = useAppStore(state => state.user.year);

    const yourTeachers = data?.filter(
        t => t.inCharge?.course === course && t.inCharge?.year === year
    ) ?? [];

    const otherTeachers = data?.filter(
        t => t.inCharge?.course !== course || t.inCharge?.year !== year
    ) ?? [];

    // Build a flat list of sections so a single vertical FlashList
    // drives the whole page — no ScrollView, no nesting issues.
    const sections = isLoading
        ? [
            { key: "skeleton-yours", type: "skeleton", title: "Your Teachers" },
            { key: "skeleton-others", type: "skeleton", title: "Other Teachers" },
          ]
        : [
            yourTeachers.length
                ? { key: "yours", type: "section", title: "Your Teachers", teachers: yourTeachers }
                : null,
            otherTeachers.length
                ? { key: "others", type: "section", title: yourTeachers.length ? "Other Teachers" : "Teachers", teachers: otherTeachers }
                : null,
          ].filter(Boolean);

    return (
        <View className="bg-primary flex-1">
            <Header />
            <FlashList
                data={sections}
                keyExtractor={item => item.key}
                estimatedItemSize={400}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    if (item.type === "skeleton") {
                        return <SkeletonSection title={item.title} />;
                    }
                    return (
                        <HorizontalSection
                            title={item.title}
                            teachers={item.teachers}
                            course={course}
                            year={year}
                        />
                    );
                }}
            />
        </View>
    );
};

export default TeachersList;
