import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from "react-native";

const { width: vw } = Dimensions.get("window");
export const ITEM_SIZE = (vw - 6 * 10) / 5,
    MARGIN_X = 6,
    MARGIN_Y = 10;

import CheckBox from "@components/common/CheckBox.jsx";

export const AttendanceItem = ({ item, toggleAttendance, isSelecting }) => {
    return (
        <TouchableOpacity
            style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                marginHorizontal: MARGIN_X,
                marginVertical: MARGIN_Y,
                elevation: 3,
                borderRadius: ITEM_SIZE / 2,
                backgroundColor: item.present ? "rgb(196, 181, 253)" : "white",
                justifyContent: "center",
                alignItems: "center"
            }}
            delayLongPress={150}
            onLongPress={() => (isSelecting.value = true)}
            onPress={() => toggleAttendance(item.id)}>
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                    fontSize: 30,
                    fontWeight: "900",
                    textAlign: "center"
                }}>
                {item.id}
            </Text>
        </TouchableOpacity>
    );
};

export const Options = ({ loading }) => {
    const [selectAll, setSelectAll] = useState(false);

    return (
        <View className="flex-row justify-between items-center px-5 mt-5">
            {loading && (
                <View className="flex-row justify-center items-center gap-1">
                    <Text className="font-bold text-xl">syncing</Text>
                    <ActivityIndicator size="16" color="#000" />
                </View>
            )}

            <View className="flex-row gap-1 justify-center items-center ml-auto">
                <Text className="font-bold text-2xl">Mark All</Text>
                <CheckBox
                    checked={selectAll}
                    onChange={setSelectAll}
                    styles={{ padding: 20 }}
                    size={22}
                />
            </View>
        </View>
    );
};

export const ListEmptyComponent = () => (
    <Text className="mt-5 px-3 text-center text-orange-500 font-semibold text-xl">
        There are no verified students found for this class, or roll numbers
        have not been assigned yet. {"\n"} Please contact the class teacher for
        more details.
    </Text>
);
