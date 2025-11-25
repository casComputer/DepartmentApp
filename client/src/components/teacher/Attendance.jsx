import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";

const { width: vw } = Dimensions.get("window");
const ITEM_SIZE = (vw - 6 * 10) / 5;

import CheckBox from "@components/common/CheckBox.jsx";

export const AttendanceItem = ({ item, toggleAttendance }) => {
    return (
        <TouchableOpacity
            style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                margin: 6,
                marginVertical: 10,
                elevation: 3, // mmm
                borderRadius: ITEM_SIZE / 2,
                backgroundColor: item.present ? 'rgb(196, 181, 253)' : 'white',
                justifyContent: 'center',
                alignItems: 'center',
                
            }}
            onPress={() => toggleAttendance(item?.id)}
        >
            <Text
            
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ fontSize: 30, fontWeight: "900", textAlign: "center" }}
            >
                {item?.id}
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
