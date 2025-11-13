import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

const AssignClass = () => {
  return (
    <View className="flex-1 mt-12">
      <View className="flex-row items-center gap-3 px-3">
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Text className="font-black text-[7vw]">Assign Class</Text>
      </View>


    <Text className=" text-gray-900 text-xl mt-16 px-5 font-bold text-[6vw] ">
      Select the class:
      </Text>

      <TouchableOpacity>
        <View className="mx-5 mt-5 p-4 border border-gray-300 rounded-lg">
          <Text className="text-gray-900 text-lg">BCA</Text>
        </View>
      </TouchableOpacity>


    </View>
  );
};

export default AssignClass;
