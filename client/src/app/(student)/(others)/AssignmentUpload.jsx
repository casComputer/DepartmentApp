import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { handleDocumentPick } from "@controller/student/assignment.controller.js";

import Header from "@components/common/Header2.jsx";

const AssignmentUpload = () => {
  const { assignmentId, topic, description, dueDate } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Header />

      <View className="p-5">
        <Text className="text-3xl font-black dark:text-white mt-5">
          Topic: {topic}
        </Text>
        <Text className="text-lg mt-3 dark:text-zinc-400">
          Description: {description}
        </Text>
        <Text className="text-lg mb-6 mt-3 dark:text-white">
          Due Date: {new Date(dueDate).toLocaleDateString()}
        </Text>
        {/* Add your file upload component or logic here */}
        <TouchableOpacity className="" onPress={handleDocumentPick}>
          <Text className="text-blue-500 text-center font-bold text-3xl mt-5">
            Select File
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AssignmentUpload;
