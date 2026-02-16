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

const ICONS_SIZE = 30;

const optionsData = [
    {
        Icon: SimpleLineIcons,
        iconName: "note",
        text: "Attendance",
        locaton: "/(student)/(others)/MonthlyReport"
    },
    {
        Icon: SimpleLineIcons,
        iconName: "notebook",
        text: "Assignment",
        locaton: "/(student)/(others)/Assignment"
    },
    {
        Icon: FontAwesome6,
        iconName: "hand-holding-dollar",
        text: "Fees",
        locaton: "/(student)/(others)/Fees"
    },
    {
        Icon: AntDesign,
        iconName: "file-search",
        text: "Exam Results",
        locaton: "/(student)/(others)/ExamResult"
    },
    {
        Icon: Feather,
        iconName: "check-circle",
        text: "Internal Marks",
        locaton: "/(student)/(others)/InternalMark"
    },

    {
        Icon: Octicons,
        iconName: "person",
        text: "Teachers",
        locaton: "/(student)/(others)/TeachersList"
    }
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
                className="text-sm font-semibold text-center text-text"
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const StudentOptions = () => {
    return (
        <View className="px-2 mt-5">
            <View className="bg-card border-border border rounded-3xl py-3" style={{
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)"
            }}>
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
                    style={{ paddingHorizontal: 8 }}
                />
            </View>
        </View>
    );
};

export default StudentOptions;
