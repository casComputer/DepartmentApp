import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const MiniAttentdenceCard = () => {
  return (
    <View className="px-6 mt-12">
      <TouchableOpacity className="shadow bg-white w-full rounded-3xl overflow-hidden p-8 gap-8">
        {/* Top */}
        <View className="flex-row items-center">
          <Text className="text-black text-5xl font-bold">27</Text>
          <View className="ml-5">
            <Text className="text-black text-xl font-semibold">Wednesday</Text>
            <Text className="text-black text-md font-semibold ">
              Augest 2025
            </Text>
          </View>
        </View>

        {/* Bottom */}
        <View>
          <Text className="text-black text-xl font-semibold ">
            Todays Attendance
          </Text>
          <View className="flex-row items-center mt-4 gap-4">
            <View className="w-8 h-8 bg-green-500 rounded-full justify-center items-center">
              <Text className="text-white font-black text-xl">
                1
              </Text>
            </View>
            
            <View className="w-8 h-8 bg-green-500 rounded-full justify-center items-center">
              <Text className="text-white font-black text-xl">
                2
              </Text>
            </View>
            
            <View className="w-8 h-8 bg-green-500 rounded-full justify-center items-center">
              <Text className="text-white font-black text-xl">
                3
              </Text>
            </View>
            
            <View className="w-8 h-8 bg-green-500 rounded-full justify-center items-center">
              <Text className="text-white font-black text-xl">
                4
              </Text>
            </View>
            
            <View className="w-8 h-8 bg-green-500 rounded-full justify-center items-center">
              <Text className="text-white font-black text-xl">
                5
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MiniAttentdenceCard;
