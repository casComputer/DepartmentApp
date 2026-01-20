import { View, Text, TouchableOpacity } from "react-native";
import {
    AntDesign,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome6,
    MaterialCommunityIcons,
    SimpleLineIcons,
    Octicons
} from "@icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

const ICONS_SIZE = 35;

const optionsData = [
    {
        Icon: SimpleLineIcons,
        iconName: "note",
        text: "Attendance",
        locaton: "/(student)/(others)/MonthlyReport",
    },
    {
        Icon: SimpleLineIcons,
        iconName: "notebook",
        text: "Assignment",
        locaton: "/(student)/(others)/Assignment",
    },
    {
        Icon: FontAwesome6,
        iconName: "hand-holding-dollar",
        text: "Fees",
        locaton: "/(student)/(others)/Fees",
    },
    {
        Icon: AntDesign,
        iconName: "file-search",
        text: "Exam Results",
        locaton: "/(student)/(others)/ExamResult",
    },
    {
        Icon: Feather,
        iconName: "check-circle",
        text: "Internal Marks",
        locaton: "",
    },

    {
        Icon: Octicons,
        iconName: "person",
        text: "Teachers",
        locaton: "/(student)/(others)/TeachersList",
    },
];

const Option = ({ Icon, iconName, text = "", locaton }) => {
    const handlePress = () => {
        router.push(locaton);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="justify-center items-center gap-2 my-5"
        >
            <Icon name={iconName} size={ICONS_SIZE} />

            <Text
                allowFontScaling={false}
                adjustsFontSizeToFit
                numberOfLines={1}
                className="text-sm font-semibold text-center dark:text-white"
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const StudentOptions = () => {
    return (
        <View className="px-3 mt-5">
            <View className="bg-card rounded-3xl py-5">
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
                    numColumns={3}
                    style={{ paddingHorizontal: 12 }}
                />
            </View>
        </View>
    );
};

export default StudentOptions;
