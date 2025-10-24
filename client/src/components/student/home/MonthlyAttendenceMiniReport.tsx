import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import CircularProgress from "@components/common/CircularProgress";

export default function MonthlyAttendenceMiniReport() {
  return (
    <TouchableOpacity className="shadow bg-white w-[90%] mx-auto mt-12  rounded-3xl overflow-hidden p-5 gap-8 flex-row justify-between items-center">
        <View className="flex-1">
          <CircularProgress progress={83} />
          <Text adjustsFontSizeToFit numberOfLines={1} className="text-center text-lg font-semibold mt-4">
            Attendance
          </Text>
        </View>
        <View className="flex-1">
          <CircularProgress
            progress={3}
            maxProgress={30}
            showPercentage={false}
          />
          <Text adjustsFontSizeToFit numberOfLines={1} className="text-center text-lg font-semibold mt-4">
            Leave Taken
          </Text>
        </View>
        <View className="flex-1">
          <CircularProgress
            progress={23}
            showPercentage={false}
            maxProgress={30}
          />
          <Text adjustsFontSizeToFit numberOfLines={1} className="text-center text-lg font-semibold mt-4">
            Ongoing Days
          </Text>
        </View>
      
    </TouchableOpacity>
  );
}
