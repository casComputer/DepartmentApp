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

import Animated, { FadeInDown } from "react-native-reanimated";
import { useApplePressAnimation } from "../../hooks/useAppleAnimation.js";

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

const Option = ({ item }) => {
    const { animatedStyle, onPressIn, onPressOut } = useApplePressAnimation();

    const Icon = item.Icon;

    return (
        <Animated.View style={[animatedStyle, { flex: 1 }]}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={() => item.locaton && router.push(item.locaton)}
                className="bg-card border border-border rounded-2xl p-4"
                style={{
                    margin: 4,
                    ...(item.fullWidth
                        ? {
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 16
                          }
                        : {
                              minHeight: 110,
                              gap: 12
                          })
                }}>
                <View
                    style={{
                        backgroundColor: item.accent + "20",
                        borderRadius: 12,
                        padding: 9,
                        borderWidth: 1,
                        borderColor: item.accent + "35"
                    }}
                    className="flex-row items-center gap-3">
                    <Icon
                        name={item.iconName}
                        size={ICONS_SIZE}
                        color={item.accent}
                    />
                    <Text className="text-text font-bold text-sm">
                        {item.text}
                    </Text>
                </View>

                <View style={{ flex: item.fullWidth ? 1 : undefined }}>
                    <Text className="text-text-secondary text-xs opacity-70">
                        {item.sub}
                    </Text>
                </View>

                {item.fullWidth && (
                    <MaterialIcons
                        name="chevron-right"
                        size={18}
                        color={item.accent}
                        style={{ opacity: 0.6 }}
                    />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const AnimatedOption = ({ item, index }) => {
    return (
        <View style={{ flex: 1 }}>
            <Option item={item} />
        </View>
    );
};

const TeacherOptions = () => {
    const isInCharge = useAppStore(
        state => state.user.in_charge_course && state.user.in_charge_year
    );

    const filteredOptions = optionsData.filter(
        opt => !opt.requiresInCharge || isInCharge
    );

    return (
        <View className="px-2 mt-6">
            <Animated.View entering={FadeInDown.delay(200).springify()}>
                <Text className="text-text-secondary text-xs font-semibold uppercase ml-3 mb-2 opacity-60">
                    Quick Actions
                </Text>
            </Animated.View>

            <FlashList
                data={filteredOptions}
                numColumns={2}
                estimatedItemSize={120}
                keyExtractor={item => item.text}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                    <AnimatedOption item={item} index={index} />
                )}
                overrideItemLayout={(layout, item) => {
                    if (item.fullWidth) layout.span = 2;
                }}
            />
        </View>
    );
};

export default TeacherOptions;
