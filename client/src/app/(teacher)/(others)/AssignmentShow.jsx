import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from  "@tanstack/react-query";

import Header from "@components/common/Header2.jsx";
import { AssignmentShowRenderItem as RenderItem } from "@components/teacher/Assignment.jsx";
import queryClient from "@utils/queryClient.js";

const AssignmentShow = () => {
    const { assignmentId } = useLocalSearchParams();
    const [assignment, setAssignment] = useState({})

    const infiniteData = queryClient.getQueryData(["assignments"]);
    const data = infiniteData.pages
        .flatMap(page => page.assignments)
        ?.find(a => a._id === assignmentId);
        
    useEffect(()=>{
        setAssignment(data)
    }, [data])

    return (
        <View className="flex-1 bg-primary">
            <Header />
            <Text className="font-bold text-3xl text-text px-3 my-3">
                {assignment.topic}
            </Text>

            <FlashList
                data={assignment.submissions || []}
                renderItem={({ item }) => (
                    <RenderItem item={item} assignmentId={assignment?._id} setAssignment={setAssignment} />
                )}
                contentContainerStyle={{
                    paddingHorizontal: 15
                }}
                ListEmptyComponent={
                    <Text className="mt-5 text-center text-text text-xl font-bold">
                        No Submissions Yet.
                    </Text>
                }
                showVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default AssignmentShow;
