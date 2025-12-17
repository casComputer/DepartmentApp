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
      <Text className="text-xl font-bold pl-3 text-text">
        {year} {course}
      </Text>
      {loading ? (
        <Text className="text-md font-semibold py-2 text-text">
          syncing..
        </Text>
      ) : (
        <View className="flex-row justify-center items-center gap-2">
          <TouchableOpacity
            onPress={() => router.push("(teacher)/AssignRollNumber")}
            disabled={verifying}
            className="px-4 py-2 rounded-3xl bg-btn justify-center items-center"
          >
            <Text className="text-md font-bold text-text">Roll Number</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePress}
            disabled={verifying}
            className="px-4 py-2 rounded-3xl bg-btn justify-center items-center"
          >
            <Text className="text-md font-bold text-text">
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
  <Text className="text-2xl font-black pt-14 text-center text-text">
    {statusMessages[status] || ""}
  </Text>
);
