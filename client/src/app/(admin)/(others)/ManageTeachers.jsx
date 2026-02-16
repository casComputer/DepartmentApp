import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import { fetchTeachers } from "@controller/admin/teachers.controller.js";
import { useAdminStore } from "@store/admin.store.js";

import TeacherItem from "@components/common/UserItem.jsx";
import Header from "@components/common/Header.jsx";

const ManageTeachers = () => {
    const teachers = useAdminStore((state) => state.teachers);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchTeachers().then(() => setLoading(false));
    }, []);

    return (
        <View className="flex-1 bg-primary">
            <Header title={"Manage Teachers"} />

            <FlashList
                data={teachers ?? []}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item?.userId ?? index}
                className="px-2 pt-16 opacity-10"
                contentContainerStyle={{ paddingBottom: 60 }}
                renderItem={({ item }) => (
                    <TeacherItem
                        item={item}
                        handlePress={() =>
                            item?.userId &&
                            router.push({
                                pathname: "(admin)/(others)//VerifyTeacher",
                                params: { userId: item?.userId },
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" />
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
