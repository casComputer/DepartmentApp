import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { withUniwind } from "uniwind";

import CheckBox from "@components/common/CheckBox.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

const StyledActivityIndicator = withUniwind(ActivityIndicator);
const { width: vw } = Dimensions.get("window");

const ITEM_SIZE = (vw - 6 * 12) / 5,
    MARGIN_X = 4,
    MARGIN_Y = 10;

export const AttendanceItem = React.memo(
    ({ item, toggleAttendance, onItemLayout, onLongPress }) => {
        return (
            <TouchableOpacity
                onLayout={onItemLayout}
                style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    marginHorizontal: MARGIN_X,
                    marginVertical: MARGIN_Y,
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.5)",
                    borderRadius: ITEM_SIZE / 2,
                    justifyContent: "center",
                    alignItems: "center"
                }}
                onLongPress={onLongPress}
                className={`${
                    item.present
                        ? "bg-violet-300 dark:bg-pink-500"
                        : "bg-zinc-500"
                }`}
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
    },
    (prevProps, nextProps) => {
        // Custom comparison
        return (
            prevProps.item.rollno === nextProps.item.rollno &&
            prevProps.item.present === nextProps.item.present
        );
    }
);

export const Options = ({ loading }) => {
    const [selectAll, setSelectAll] = useState(false);

    return (
        <View className="flex-row justify-between items-center px-5 mt-5">
            {loading && (
                <View className="flex-row justify-center items-center gap-1">
                    <Text className="font-bold text-xl dark:text-white">
                        syncing
                    </Text>
                    <StyledActivityIndicator
                        size="16"
                        className="text-black datk:text-white"
                    />
                </View>
            )}

            <View className="flex-row gap-1 justify-center items-center ml-auto">
                <Text className="font-semibold text-xl dark:text-white ">
                    Mark All
                </Text>
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
                <Text
                    numberOfLines={1}
                    className="text-md font-semibold dark:text-white">
                    Present: {present}
                </Text>
                <Text
                    numberOfLines={1}
                    className="text-md font-semibold dark:text-white">
                    Absent: {absent}
                </Text>
                <Text
                    numberOfLines={1}
                    className="text-md font-semibold dark:text-white">
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
                    className="text-lg font-semibold text-right dark:text-white">
                    Strength: {strength}
                </Text>
            </View>
        </View>
    );
};

export const AttendanceHistoryRenderItem = ({ item }) => {
    const present = item.present_count;
    const absent = item.absent_count;
    const late_present = item.late_count;
    const strength = item.strength;

    return (
        <View className="w-full px-4 my-2">
            <View
                className="w-full bg-white rounded-3xl px-5 py-8 dark:bg-zinc-900"
                style={{ boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.5)" }}>
                <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold dark:text-white">
                        {item.year} {item.course} {"\n"}
                        {item.hour} Hour
                    </Text>
                    <Text className="text-xl font-bold text-right dark:text-white">
                        {item.timestamp.split(" ").join("\n")}
                    </Text>
                </View>

                <AttendanceHistoryExtra
                    present={present}
                    absent={absent}
                    late_present={late_present}
                    strength={strength}
                />
            </View>
        </View>
    );
};
