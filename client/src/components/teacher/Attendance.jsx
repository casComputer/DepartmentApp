import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { withUniwind } from "uniwind";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import CheckBox from "@components/common/CheckBox.jsx";
import CircularProgress from "@components/common/CircularProgress.jsx";

const StyledActivityIndicator = withUniwind(ActivityIndicator);
const { width: vw } = Dimensions.get("window");

const ITEM_SIZE = (vw - 6 * 12) / 5,
    MARGIN_X = 4,
    MARGIN_Y = 10;

export const AttendanceItem = React.memo(
    ({
        item,
        toggleAttendance,
        onItemLayout,
        onLongPress,
        isEditable = true
    }) => {
        if (!item.rollno) return;

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
                className={`${item.present ? "bg-btn dark:bg-[#4F46E5]" : "bg-card"}`}
                onPress={() => toggleAttendance(item.rollno)}
                disabled={!isEditable}
            >
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    className="text-text text-[30px] font-semibold text-center w-[90%]"
                >
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

export const Options = ({ loading, isEditable, handleSelectAll }) => {
    const [selectAll, setSelectAll] = useState(false);

    return (
        <View className="flex-row justify-between items-center px-5 mt-5">
            {loading && (
                <View className="flex-row justify-center items-center gap-1">
                    <Text className="font-bold text-xl text-text">syncing</Text>
                    <StyledActivityIndicator size="16" className="text-text" />
                </View>
            )}

            {isEditable === true && (
                <View className="flex-row gap-1 justify-center items-center ml-auto">
                    <TouchableOpacity onPress={handleSelectAll}>
                        <Text className="font-semibold text-xl text-blue-500 ">
                            Mark All
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
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
                    className="text-md font-semibold text-text"
                >
                    Present: {present}
                </Text>
                <Text
                    numberOfLines={1}
                    className="text-md font-semibold text-text"
                >
                    Absent: {absent}
                </Text>
                <Text
                    numberOfLines={1}
                    className="text-md font-semibold text-text"
                >
                    Late: {late_present}
                </Text>
            </View>

            {/* MIDDLE */}
            <View className="flex-1 items-center">
                <CircularProgress progress={progress * 100} />
            </View>

            {/* RIGHT */}
            <View className="flex-1 gap-2">
                <Text
                    numberOfLines={1}
                    className="text-lg font-semibold text-right text-text"
                >
                    Strength: {strength}
                </Text>
            </View>
        </View>
    );
};

export const AttendanceHistoryRenderItem = ({
    item,
    haveFullAccess = false
}) => {
    if (!item) return null;

    const present = item.present_count;
    const absent = item.absent_count;
    const late_present = item.late_count;
    const strength = item.strength;

    const MINUTES = 15 * 60 * 1000; // 15 min for edit attendance
    const date = new Date(item.timestamp);
    const isEditable = Date.now() - date.getTime() <= MINUTES;

    return (
        <View className="w-full px-3 my-2">
            <View
                className="w-full bg-card rounded-3xl px-5 py-6"
                style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            >
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-black text-text">
                        {item.year} {item.course} {"\n"}
                        {item.hour} Hour
                    </Text>
                    <Text className="opacity-70 text-sm font-bold text-right text-text">
                        {date.toLocaleString().split(",").join("\n")}
                    </Text>
                </View>

                <AttendanceHistoryExtra
                    present={present}
                    absent={absent}
                    late_present={late_present}
                    strength={strength}
                />

                {haveFullAccess && (
                    <>
                        <Text className="text-md font-bold text-text text-center py-2 mt-1">
                            This attendance was taken by {item.teacherId}
                        </Text>
                        {item.updated_by && item.updated_timestamp && (
                            <Text className="text-sm font-normal text-text text-center opacity-80">
                                This attendance was updated by
                                {" " + item.updated_by + "\n"}
                                on
                                {" " +
                                    new Date(
                                        item.updated_timestamp
                                    )?.toLocaleString()}
                            </Text>
                        )}
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/common/attendance/Attendance",
                                    params: {
                                        course: item.course,
                                        year: item.year,
                                        hour: item.hour,
                                        isEditable: false,
                                        date: item.date
                                    }
                                })
                            }
                            className="mt-3 bg-card-selected rounded-lg"
                        >
                            <Text className="text-xl font-black text-blue-500 text-center py-2">
                                View
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {(haveFullAccess || isEditable) && (
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/common/attendance/Attendance",
                                params: {
                                    course: item.course,
                                    year: item.year,
                                    date: item.date,
                                    hour: item.hour
                                }
                            })
                        }
                        className="mt-3 bg-card-selected rounded-lg"
                    >
                        <Text className="text-xl font-black text-green-500 text-center py-2">
                            Edit
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
