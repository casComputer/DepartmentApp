import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export const ListHeaderComponent = ({
  loading,
  year,
  course,
  handleVerifyAll,
}) => {
  const [verifying, setVerifying] = useState(false);

  const handlePress = async () => {
    setVerifying(true);
    await handleVerifyAll();
    setVerifying(false);
  };

  return (
    <View className="flex-row justify-between items-center py-5">
      <Text className="text-xl font-bold pl-3 dark:text-white">
        {year} {course}
      </Text>
      {loading ? (
        <Text className="text-md font-semibold py-2 dark:text-white">
          syncing..
        </Text>
      ) : (
        <View className="flex-row justify-center items-center gap-2">
          <TouchableOpacity
            onPress={() => router.push("(teacher)/AssignRollNumber")}
            disabled={verifying}
            className="px-4 py-2 rounded-3xl bg-emerald-500 justify-center items-center"
          >
            <Text className="text-md font-bold text-white">Roll Number</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePress}
            disabled={verifying}
            className="px-4 py-2 rounded-3xl bg-emerald-500 justify-center items-center"
          >
            <Text className="text-md font-bold text-white">
              {verifying ? "Verifying" : "Verify All"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const statusMessages = {
  LOADING: "Loading...",
  ERROR: "Something Went Wrong!, Try again later.",
  CLASS_EMPTY: "No Students Yet!",
  NO_CLASS_ASSIGNED: "You are not assigned to any class!",
};

export const ListEmptyComponent = ({ status }) => (
  <Text className="text-2xl font-black pt-14 text-center dark:text-white">
    {statusMessages[status] || ""}
  </Text>
);
