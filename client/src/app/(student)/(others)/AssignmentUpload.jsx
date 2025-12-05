import { View, Text } from "react-native";
// import * as DocumentPicker from "expo-document-picker";

import Header from "@components/common/Header2.jsx";
import { useLocalSearchParams } from "expo-router";

const AssignmentUpload = () => {
  const { assignmentId, topic, description } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Header />

      <View className="p-5">
        <Text className="text-3xl font-black dark:text-white">
          Topic: {topic}
        </Text>
        <Text className="text-lg mb-6 mt-3 dark:text-white">
          Description: {description}
        </Text>
        {/* Add your file upload component or logic here */}
      </View>
    </View>
  );
};

export default AssignmentUpload;
