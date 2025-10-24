import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import CircularProgress from "@components/common/CircularProgress";

export default function MonthlyAttendenceMiniReport() {
  return (
    <View className="px-6 mt-12">
      <TouchableOpacity className="shadow bg-white w-full rounded-3xl overflow-hidden p-5 gap-8 flex-row justify-between items-center">
        <View>
          <CircularProgress progress={83} />
          <Text className="text-center text-lg font-semibold mt-4">
            Attendence
          </Text>
        </View>
        <View>
          <CircularProgress progress={3} maxProgress={30} showPercentage={false} />
          <Text className="text-center text-lg font-semibold mt-4">
            Leave Taken
          </Text>
        </View>
        <View>
          <CircularProgress progress={23} showPercentage={false} maxProgress={30} />
          <Text className="text-center text-lg font-semibold mt-4">
            Ongoing Days
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}