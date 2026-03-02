import { View, Text, TouchableOpacity } from "react-native";
import {
    FontAwesome5,
    MaterialCommunityIcons,
    Octicons,
    SimpleLineIcons,
    MaterialIcons,
    Entypo
} from "@icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";

import { useAppStore } from "@store/app.store.js";

const ICONS_SIZE = 22;

const optionsData = [
    {
        Icon: MaterialCommunityIcons,
        iconName: "account-group-outline",
        text: "Students",
        locaton: "/(teacher)/(others)/ManageStudents",
        requiresInCharge: true,
        accent: "#2f81f7",
        sub: "Class roster"
    },
    {
        requiresInCharge: true,
        Icon: MaterialCommunityIcons,
        iconName: "human-male-female-child",
        text: "Parents",
        locaton: "/(teacher)/(others)/ManageParents",
        accent: "#a371f7",
        sub: "Contacts"
    },
    {
        Icon: FontAwesome5,
        iconName: "clipboard-list",
        text: "Attendance",
        locaton: "/common/attendance/AttendanceClassSelect",
        accent: "#3fb950",
        sub: "Daily tracking"
    },
    {
        Icon: Octicons,
        iconName: "log",
        text: "Work Log",
        locaton: "/common/worklog/WorkLogSelection",
        accent: "#58a6ff",
        sub: "Add entry"
    },
    {
        Icon: SimpleLineIcons,
        iconName: "notebook",
        text: "Assignments",
        locaton: "/common/assignment/Assignment",
        accent: "#f0883e",
        sub: "Tasks & homework"
    },
    {
        Icon: MaterialIcons,
        iconName: "grade",
        text: "Internal Marks",
        locaton: "/common/internal/InternalMark",
        accent: "#e3b341",
        sub: "Score entry"
    },
    {
        requiresInCharge: true,
        Icon: MaterialIcons,
        iconName: "currency-rupee",
        text: "Fees",
        locaton: "/common/fees/Selector",
        accent: "#d29922",
        sub: "Fees"
    },
    {
        Icon: Entypo,
        iconName: "text-document",
        text: "Results",
        locaton: "/common/result/ExamResultSelector",
        accent: "#56d364",
        sub: "Exam scores"
    },
    {
        requiresInCharge: true,
        Icon: MaterialIcons,
        iconName: "assessment",
        text: "Attendance Report",
        locaton: "/common/GenerateReport",
        accent: "#79c0ff",
        sub: "Generate & export",
        fullWidth: true
    }
];

const Option = ({
    Icon,
    iconName,
    text = "",
    locaton,
    accent = "#2f81f7",
    sub = "",
    fullWidth = false
}) => {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View style={[animStyle, { flex: 1 }]}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPressIn={() => {
                    scale.value = withSpring(0.95, { damping: 20 });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, { damping: 30 });
                }}
                onPress={() => locaton && router.push(locaton as any)}
                style={{
                    flex: 1,
                    margin: 4,
                    borderRadius: 18,
                    padding: 16,
                    ...(fullWidth
                        ? {
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 16,
                              paddingVertical: 18
                          }
                        : {
                              flexDirection: "column",
                              alignItems: "flex-start",
                              gap: 12,
                              minHeight: 110
                          })
                }}
                className="bg-card border border-border"
            >
                {/* Icon badge */}
                <View
                    style={{
                        backgroundColor: accent + "20",
                        borderRadius: 12,
                        padding: 9,
                        borderWidth: 1,
                        borderColor: accent + "35",
                        alignSelf: fullWidth ? "center" : "flex-start"
                    }}
                >
                    <Icon name={iconName} size={ICONS_SIZE} color={accent} />
                </View>

                <View style={{ flex: fullWidth ? 1 : undefined }}>
                    <Text
                        allowFontScaling={false}
                        className="text-text font-bold"
                        style={{ fontSize: 14, lineHeight: 18 }}
                    >
                        {text}
                    </Text>
                    <Text
                        allowFontScaling={false}
                        className="text-text-secondary"
                        style={{ fontSize: 11, marginTop: 2, opacity: 0.6 }}
                    >
                        {sub}
                    </Text>
                </View>

                {fullWidth && (
                    <MaterialIcons
                        name="chevron-right"
                        size={18}
                        color={accent}
                        style={{ opacity: 0.6 }}
                    />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const AnimatedOption = ({ item, index }) => {
    return (
        <Animated.View
            entering={FadeInDown.delay(index * 60)
                .springify()
                .damping(15)}
            style={{ flex: 1 }}
        >
            <Option
                Icon={item.Icon}
                iconName={item.iconName}
                text={item.text}
                locaton={item.locaton}
                accent={item.accent}
                sub={item.sub}
                fullWidth={item.fullWidth}
            />
        </Animated.View>
    );
};

const TeacherOptions = () => {
    const isInCharge = useAppStore(
        state => state.user.in_charge_course && state.user.in_charge_year
    );

    const filteredOptions = optionsData.filter(
        opt => !opt.requiresInCharge || isInCharge
    );

    console.log(filteredOptions);

    return (
        <View className="px-2 mt-6">
            <Animated.Text
                entering={FadeInDown.delay(200).springify()}
                allowFontScaling={false}
                className="text-text-secondary text-xs font-semibold uppercase ml-3 mb-2"
                style={{ letterSpacing: 2, opacity: 0.6 }}
            >
                Quick Actions
            </Animated.Text>

            <FlashList
                data={filteredOptions}
                numColumns={2}
                keyExtractor={item => item.text}
                estimatedItemSize={118}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                overrideItemLayout={(layout, item) => {
                    if (item.fullWidth) layout.span = 2;
                }}
                contentContainerStyle={{
                    paddingBottom: 8,
                    paddingHorizontal: 2
                }}
                renderItem={({ item, index }) => (
                    <AnimatedOption item={item} index={index} />
                )}
            />
        </View>
    );
};

export default TeacherOptions;
