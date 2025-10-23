import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StudentOptions = () => {
  return (
    <View className="px-6 mt-12">
      <View className="shadow bg-white w-full rounded-3xl overflow-hidden p-3 grid grid-cols-3 grid-rows-2 ">
        <View className="flex-row">
          <TouchableOpacity className="p-4 justify-center items-center">
            <MaterialCommunityIcons
              name="chat-question"
              size={50}
              color="black"
            />

            <Text className="text-lg font-semibold">Ask Leave</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 justify-center items-center">
            <Image
              source={require("../../../assets/images/icons/attendence.png")}
            />

            <Text className="text-lg font-semibold">Attendence</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StudentOptions;
