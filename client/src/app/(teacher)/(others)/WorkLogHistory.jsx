import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

import Header from "@components/common/Header.jsx";

import { fetchWorklogs } from "@controller/teacher/worklog.controller";

const RenderItem = ({ item }) => (
  <View
    style={{
      shadowColor: "#000",
      boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.5)",
    }}
    className="bg-white m-2 p-4 rounded-3xl dark:bg-zinc-900"
  >
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-black dark:text-white">
        {new Date(item.date).toLocaleDateString()} {"\n"}
        Subject: {item.subject} {"\n"}
        Hour: {item.hour}
      </Text>
      <Text className="text-lg font-black dark:text-white">
        Course: {item.course} {"\n"}
        Year: {item.year} {"\n"}
        Hour: {item.hour}
      </Text>
    </View>

    <Text className="text-xl font-black mt-5 dark:text-white">Topics:</Text>
    <Text className="text-xl px-3 dark:text-white">{item.topics}</Text>
  </View>
);

const WorkLogHistory = () => {
  const {
    data: worklogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["worklogs"],
    queryFn: fetchWorklogs,
  });

  console.log(worklogs);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Header title={"History"} />

      <FlashList
        data={worklogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderItem item={item} />}
        endReachedThreshold={0.5}
        onEndReached={() => {}}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 5 }}
      />
    </View>
  );
};

export default WorkLogHistory;
