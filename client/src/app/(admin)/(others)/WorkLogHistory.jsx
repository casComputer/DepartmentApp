import { useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import Header from "@components/common/Header.jsx";
import UserItem from "@components/common/UserItem.jsx";

import { fetchTeachers } from "@controller/admin/teachers.controller.js";
import { router } from "expo-router";

const WorkLogHistory = () => {
  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => fetchTeachers(),
  });

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Header title={"History"} />

      <FlashList
        data={teachers}
        renderItem={({ item }) => (
          <UserItem
            item={item}
            showVerification={false}
            handlePress={() =>
              router.push({
                pathname: "/(admin)/(others)/WorkLogDetails",
                params: { teacherId: item.teacherId },
              })
            }
          />
        )}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default WorkLogHistory;
