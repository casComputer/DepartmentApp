import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from "react-native";

import CircularProgress from "@components/common/CircularProgress";

const { width: vw } = Dimensions.get("window");

const numberOfPies = 3;
const containerWidth = vw * 0.95;
const gap = vw * 0.1;

const size = (containerWidth - (numberOfPies - 1) * gap) / numberOfPies;

export default function MonthlyAttendenceMiniReport() {
    return (
        <TouchableOpacity
            style={{
                elevation: 3,
                shadowColor: "black",
                width: containerWidth,
                gap: gap
            }}
            className="shadow bg-white mx-auto mt-12  rounded-3xl overflow-hidden p-5 flex-row justify-between items-center">
            <View className="flex-1">
                <CircularProgress
                    progress={83}
                    size={size}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4">
                    Attendance
                </Text>
            </View>
            <View className="flex-1">
                <CircularProgress
                    progress={3}
                    maxProgress={30}
                    size={size}
                    showPercentage={false}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4">
                    Leave Taken
                </Text>
            </View>
            <View className="flex-1">
                <CircularProgress
                    progress={23}
                    size={size}
                    showPercentage={false}
                    maxProgress={30}
                    strokeFillColor={"rgb(247,55,159)"}
                />
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    className="text-center text-lg font-semibold mt-4">
                    Ongoing Days
                </Text>
            </View>
        </TouchableOpacity>
    );
}
