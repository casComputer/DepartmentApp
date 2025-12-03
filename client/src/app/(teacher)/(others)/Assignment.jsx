import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { Feather } from "@icons";

import Header from "@components/common/Header.jsx";

const Assignment = () => {
  return (
    <View className="flex-1 ">
      <Header title="Assignments" />
      <TouchableOpacity
        className=" p-4 rounded-full bg-pink-500 absolute right-5 bottom-10 justify-center items-center"
        onPress={() => router.push("/(teacher)/(others)/AssignmentCreation")}
      >
        <Feather name="plus" size={30} className="dark:text-white" />
      </TouchableOpacity>
    </View>
  );
};

export default Assignment;
