import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const ICONS_SIZE = 40;

const StudentOptions = () => {
  return (
    <View className="px-6 mt-12 flex-1">
      <View className="shadow bg-white w-full rounded-3xl gap-3 overflow-hidden py-3">
        {/* First Row of Options */}
        <View className="flex-row justify-between">
          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1 ">
            <MaterialCommunityIcons
              name="chat-question"
              size={ICONS_SIZE}
              color="black"
            />

            <Text className="text-lg font-semibold">Ask Leave</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
            <Image
              style={{ width: ICONS_SIZE, height: ICONS_SIZE }}
              source={require("@assets/images/icons/attendence.png")}
            />

            <Text className="text-lg font-semibold">Attendence</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
            <Image
              style={{ width: ICONS_SIZE, height: ICONS_SIZE }}
              source={require("@assets/images/icons/assignment.png")}
            />

            <Text className="text-lg font-semibold">Assignment</Text>
          </TouchableOpacity>
        </View>

        {/* Second Row of Options */}

        <View className="flex-row justify-between">
          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
            <FontAwesome6
              name="hand-holding-dollar"
              size={ICONS_SIZE}
              color="black"
            />

            <Text className="text-lg font-semibold">Fees</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
            <AntDesign name="file-search" size={ICONS_SIZE} color="black" />

            <Text className="text-lg font-semibold">Exam Results</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
            <AntDesign name="message" size={ICONS_SIZE} color="black" />

            <Text className="text-lg font-semibold">Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Third Row of Options */}
        <View className="flex-row justify-between">
          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
          <Entypo name="book" size={ICONS_SIZE} color="black" />
            <Text className="text-lg font-semibold">Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
          <Feather name="check-circle" size={ICONS_SIZE} color="black" />

            <Text className="text-lg font-semibold">Internal Marks</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4 justify-center items-center gap-2 flex-1">
          <FontAwesome name="graduation-cap" size={ICONS_SIZE} color="black" />

            <Text className="text-lg font-semibold">Course</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StudentOptions;
