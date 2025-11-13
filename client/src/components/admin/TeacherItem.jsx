import { View, Text, TouchableOpacity } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";

const ICON_SIZE = 18,
    DEFAULT_ICON_COLOR = "rgb(151,95,33)";
const verified = false;

const TeacherItem = ({ item }) => {
    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "(admin)/VerifyTeacher",
                    params: { user: JSON.stringify(item) }
                })
            }
            className="flex-row items-center justify-between bg-white rounded-3xl px-4 py-7 my-2 shadow-2xl"
        >
            <Text numberOfLines={1} className="text-2xl font-bold max-w-[80%]">
                {item.fullname}
            </Text>
            <View className="flex-row gap-2 justify-center items-center">
                <Octicons
                    name="verified"
                    size={18}
                    color={verified ? "#3af43a" : DEFAULT_ICON_COLOR}
                />
                <Text
                    className={`text-sm font-bold ${
                        verified ? "text-green-500" : "text-gray-500"
                    } `}
                >
                    {verified ? "Verified" : "Not Verified"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default TeacherItem;
