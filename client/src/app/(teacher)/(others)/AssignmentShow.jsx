import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header2.jsx";
import { AssignmentShowRenderItem as RenderItem } from "@components/teacher/Assignment.jsx";

// const uri =
//     "https://res.cloudinary.com/dqvgf5plc/image/upload/pg_1,f_jpg/g_center/v1765029571/oshqi1fjzvje4iz9i92c.pdf";

const AssignmentShow = () => {
  const params = useLocalSearchParams();

  const assignment = JSON.parse(params.item || {});

  return (
    <View className="flex-1 dark:bg-black">
      <Header />
      <Text className="font-bold text-3xl dark:text-white px-3 my-3">
        {assignment.topic}
      </Text>

      <FlashList
        data={assignment.submissions || []}
        renderItem={({ item }) => (
          <RenderItem item={item} assignmentId={assignment?._id} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      />
    </View>
  );
};

export default AssignmentShow;
