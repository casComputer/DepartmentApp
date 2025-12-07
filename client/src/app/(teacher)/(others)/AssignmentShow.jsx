import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";

import Header from "@components/common/Header2.jsx";
import { formatDate } from "@utils/date.js";

const { width: vw } = Dimensions.get("window");

const uri =
    "https://res.cloudinary.com/dqvgf5plc/image/upload/pg_1,f_jpg/g_center/v1765029571/oshqi1fjzvje4iz9i92c.pdf";

const RenderItem = ({ item }) => {
    console.log(item);
    return (
        <View className="justify-center items-center rounded-lg dark:bg-zinc-900 p-4 gap-2">
            <Text className="font-bold text-2xl dark:text-white ">
                {item.studentId}
            </Text>

            <Image
                source={{ uri: uri }}
                className="rounded-lg bg-zinc-950"
                style={{ width: "90%", height: 300 }}
            />

            <Text className="font-semibold text-md dark:text-white ">
                Submitted on {formatDate(item.createdAt)}{" "}
                {item.createdAt?.split("T")?.[1]?.split(".")?.[0]}
            </Text>
        </View>
    );
};

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
                renderItem={({ item }) => <RenderItem item={item} />}
                contentContainerStyle={{
                    paddingHorizontal: 20
                }}
            />
        </View>
    );
};

export default AssignmentShow;
