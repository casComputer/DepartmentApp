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

const ICONS_SIZE = 35;

const optionsData = [
    {
        Icon: MaterialCommunityIcons,
        iconName: "account-group-outline",
        text: "Students",
        locaton: "/(teacher)/(others)/ManageStudents"
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
        text: "Work Log",
        locaton: "/(teacher)/(others)/WorkLogSelection"
    },
    {
        Icon: SimpleLineIcons,
        iconName: "notebook",
        text: "Assignment",
        locaton: "/common/assignment/Assignment"
    },
    {
        Icon: MaterialIcons,
        iconName: "currency-rupee",
        text: "Fees",
        locaton: "/common/fees/Selector"
    },
    {
        Icon: Entypo,
        iconName: "text-document",
        text: "Results",
        locaton: "/(teacher)/(others)/ExamResultSelector"
    },
    {
        Icon: MaterialIcons,
        iconName: "grade",
        text: "Internal Marks",
        locaton: "/(teacher)/(others)/InternalMark"
    }
];

const Option = ({ Icon, iconName, text = "", locaton }) => {
    const handlePress = () => {
        if (!locaton) return;
        router.push(locaton as any);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="bg-card flex-row items-center gap-4 my-1 py-6 px-6 rounded-2xl"
            style={{ boxShadow: "0px 1px 3px (0,0,0,0.5)" }}
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
    return (
        <FlashList
            data={optionsData}
            renderItem={({ item }) => (
                <Option
                    Icon={item.Icon}
                    iconName={item.iconName}
                    text={item.text}
                    locaton={item.locaton}
                />
            )}
            style={{ paddingBottom: 50, paddingTop: 30, paddingHorizontal: 6 }}
        />
    );
};

export default TeacherOptions;
