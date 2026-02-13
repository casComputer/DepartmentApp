import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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

import { useAppStore } from "@store/app.store.js";

const ICONS_SIZE = 35;
const optionsData = [
    {
        Icon: MaterialCommunityIcons,
        iconName: "account-group-outline",
        text: "Students",
        locaton: "/(teacher)/(others)/ManageStudents",
        requiresInCharge: true
    },
    {
        requiresInCharge: true,
        Icon: MaterialCommunityIcons,
        iconName: "human-male-female-child",
        text: "Parents",
        locaton: "/(teacher)/(others)/ManageParents"
    },
    {
        Icon: FontAwesome5,
        iconName: "clipboard-list",
        text: "Attendance",
        locaton: "/common/attendance/AttendanceClassSelect"
    },
    {
        Icon: Octicons,
        iconName: "log",
        text: "Add Work Log",
        locaton: "/common/worklog/WorkLogSelection"
    },
    {
        Icon: SimpleLineIcons,
        iconName: "notebook",
        text: "Assignment",
        locaton: "/common/assignment/Assignment"
    },
    {
        Icon: MaterialIcons,
        iconName: "grade",
        text: "Internal Marks",
        locaton: "/(teacher)/(others)/InternalMark"
    },
    {
        requiresInCharge: true,
        Icon: MaterialIcons,
        iconName: "currency-rupee",
        text: "Fees",
        locaton: "/common/fees/Selector"
    },
    {
        requiresInCharge: true,
        Icon: Entypo,
        iconName: "text-document",
        text: "Results",
        locaton: "/(teacher)/(others)/ExamResultSelector"
    },
    {
        requiresInCharge: true,
        Icon: MaterialIcons,
        iconName: "grade",
        text: "Generate Attendance Report",
        locaton: "/common/GenerateReport",
        fullWidth: true
    }
];

const handlePress = locaton => {
    if (!locaton) return;
    router.push(locaton as any);
};
const Option = ({ Icon, iconName, text = "", locaton }) => {
    return (
        <TouchableOpacity
            onPress={() => handlePress(locaton)}
            className="flex-1 bg-card flex-row items-center gap-4 m-1 py-6 px-6 rounded-2xl"
            style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
        >
            <Icon
                name={iconName}
                size={ICONS_SIZE}
                style={{ minWidth: "10%" }}
            />

            <Text
                allowFontScaling={false}
                adjustsFontSizeToFit
                numberOfLines={1}
                className="text-md font-bold text-center text-text"
            >
                {text}
            </Text>
        </TouchableOpacity>
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
        <FlashList
            data={filteredOptions}
            numColumns={2}
            keyExtractor={item => item.text}
            estimatedItemSize={90}
            showsVerticalScrollIndicator={false}
            overrideItemLayout={(layout, item) => {
                if (item.fullWidth) layout.span = 2
            }}
            contentContainerStyle={{
                paddingBottom: 110,
                paddingTop: 30,
                paddingHorizontal: 4,
            }}
            renderItem={({ item }) => (
                <Option
                    Icon={item.Icon}
                    iconName={item.iconName}
                    text={item.text}
                    locaton={item.locaton}
                />
            )}
        />
    );
};

export default TeacherOptions;
