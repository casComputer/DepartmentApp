import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from "react-native";

import CheckBox from "@components/common/CheckBox.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

const { width: vw } = Dimensions.get("window");

export const ITEM_SIZE = (vw - 6 * 10) / 5,
    MARGIN_X = 6,
    MARGIN_Y = 10;


export const AttendanceItem = ({ item, toggleAttendance, isSelecting }) => {
    return (
        <TouchableOpacity
            style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                marginHorizontal: MARGIN_X,
                marginVertical: MARGIN_Y,
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                borderRadius: ITEM_SIZE / 2,
                backgroundColor: item.present ? "rgb(196, 181, 253)" : "white",
                justifyContent: "center",
                alignItems: "center"
            }}
            onPress={() => toggleAttendance(item.rollno)}>
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                    fontSize: 30,
                    fontWeight: "900",
                    textAlign: "center",
                    width: "90%"

                }}>
                {item.rollno}
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

const AttendanceHistoryExtra = ({
    present = 0,
    absent = 0,
    late_present = 0,
    strength = 0
}) => {
    const totalPresent = present + late_present;
    const progress = strength === 0 ? 0 : present / strength;

    return (
        <View className="flex-row items-center">
            {/* LEFT */}
            <View className="flex-1">
                <Text numberOfLines={1} className="text-md font-semibold">
                    Present: {present}
                </Text>
                <Text numberOfLines={1} className="text-md font-semibold">
                    Absent: {absent}
                </Text>
                <Text numberOfLines={1} className="text-md font-semibold">
                    Late: {late_present}
                </Text>
            </View>

            {/* MIDDLE */}
            <View className="flex-1 items-center">
                <CircularProgress progress={progress * 100} />
            </View>

            {/* RIGHT */}
            <View className="flex-1">
                <Text
                    numberOfLines={1}
                    className="text-lg font-semibold text-right">
                    Strength: {strength}
                </Text>
            </View>
        </View>
    );
};

export const AttendanceHistoryRenderItem = ({ item, index }) => {
    const present = item.present_count;
    const absent = item.absent_count;
    const late_present = item.late_count;
    const strength = item.strength;

    console.log(index);

    return (
        <View
            className="w-full px-4 my-2">
            <TouchableOpacity
                className="w-full bg-white rounded-3xl px-5 py-8"
                style={{ elevation: 5, shadowColor: "black" }}>
                <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold">
                        {item.year} {item.course} {"\n"}
                        {item.hour} Hour
                    </Text>
                    <Text className="text-xl font-bold text-right">
                        {item.timestamp.split(" ").join("\n")}
                    </Text>
                </View>

                <AttendanceHistoryExtra
                    present={present}
                    absent={absent}
                    late_present={late_present}
                    strength={strength}
                />
           </TouchableOpacity>
        </View>
    );
};
