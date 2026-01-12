import { View, Text, TouchableOpacity } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

const ICON_SIZE = 18,
    DEFAULT_ICON_COLOR = "rgb(151,95,33)";

const UserItem = ({
    item,
    handlePress,
    highlight,
    showVerification = true,
}) => {
    
    return (
        <TouchableOpacity
            onPress={() => handlePress(item)}
            style={{
                borderColor: highlight ? "red" : "transparent",
                borderWidth: highlight ? 1 : 0,
            }}
            className="flex-row items-center justify-between bg-card rounded-3xl px-4 py-7 my-2"
        >
            <Text
                numberOfLines={1}
                className="text-2xl font-bold max-w-[80%] text-text"
            >
                {item.fullname}
            </Text>
            {showVerification && (
                <View className="flex-row gap-2 justify-center items-center">
                    <Octicons
                        name="verified"
                        size={ICON_SIZE}
                        color={
                            item.is_verified ? "#3af43a" : DEFAULT_ICON_COLOR
                        }
                    />
                    <Text
                        className={`text-sm font-bold ${
                            item.is_verified
                                ? "text-green-500"
                                : "text-gray-500"
                        } `}
                    >
                        {item.is_verified ? "Verified" : "Not Verified"}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default UserItem;
