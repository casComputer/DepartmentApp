import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";

const { width: vw } = Dimensions.get("window");
const ITEM_SIZE = (vw - 6 * 10) / 5;

import CheckBox from "@components/common/CheckBox.jsx";

export const AttendanceItem = ({ item }) => {
    return (
        <TouchableOpacity
            style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                margin: 6,
                marginVertical: 10
            }}
            className="rounded-full justify-center items-center bg-white">
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ fontSize: vw * 0.08 }}
                className="font-black text-center">
                {item.id}
            </Text>
        </TouchableOpacity>
    );
};

export const Options = () => {
    const [selectAll, setSelectAll] = useState(false);

    return (
        <View className="flex-row justify-end items-center gap-5 px-3">
            <View className="flex-row justify-center items-center gap-1">
                <Text className="font-bold text-xl">Mark All</Text>
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
