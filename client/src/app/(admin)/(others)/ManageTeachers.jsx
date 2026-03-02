import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { fetchTeachers } from "@controller/admin/teachers.controller.js";

import TeacherItem from "@components/common/UserItem.jsx";
import Loader from "@components/common/Loader";
import Header from "@components/common/Header.jsx";

const ManageTeachers = () => {
    const {
        data: teachers,
        isLoading: loading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ["teachers"],
        queryFn: () => fetchTeachers()
    });

    return (
        <View className="flex-1 bg-primary">
            <Header title={"Manage Teachers"} />

            <FlashList
                data={teachers ?? []}
                showsVerticalScrollIndicator={false}
                onRefresh={refetch}
                refreshing={isRefetching}
                keyExtractor={(item, index) => item?.userId ?? index}
                className="px-2 pt-16"
                contentContainerStyle={{ paddingBottom: 60 }}
                renderItem={({ item }) => (
                    <TeacherItem
                        item={item}
                        handlePress={() =>
                            item?.userId &&
                            router.push({
                                pathname: "(admin)/(others)//VerifyTeacher",
                                params: { userId: item?.userId }
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    loading ? (
                        <Loader size="large" />
                    ) : (
                        !teachers.length && (
                            <Text className="text-lg font-bold text-text text-center mt-3">
                                No teachers registered yet!
                            </Text>
                        )
                    )
                }
            />
        </View>
    );
};

export default ManageTeachers;
