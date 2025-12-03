import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header.jsx";

import { getAssignment } from "@controller/student/assignment.controller.js";

const RenderItem = ({ item }) => (
  <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: "/(student)/(others)/AssignmentUpload",
        params: {
          assignmentId: item._id,
          topic: item.topic,
          description: item.description,
        },
      })
    }
    className="p-5 rounded-3xl dark:bg-zinc-900 my-2"
    style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}
  >
    <Text className="text-xl font-black dark:text-white">{item.topic}</Text>
    <Text className="text-gray-600 font-bold text-lg pl-3 dark:text-white">
      {item.description}
    </Text>
    <Text className="text-xl font-black mt-3 dark:text-white">
      {item.year} {item.course}
    </Text>
    <Text className="font-black text-lg dark:text-white">
      Due Date:
      {new Date(item.dueDate).toLocaleDateString()}
    </Text>
  </TouchableOpacity>
);

const Assignment = () => {
  const { data, fetchNextPage, isFetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["assignments"],
      queryFn: ({ pageParam = 1 }) => getAssignment({ pageParam }),
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextPage : undefined,
    });

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Header title="Assignments" />

      <FlashList
        data={data?.pages.flatMap((page) => page.assignments) || []}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <RenderItem item={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
          gap: 16,
          paddingTop: 16,
        }}
      />
    </View>
  );
};

export default Assignment;
