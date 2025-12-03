import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

import { fetchTeachers } from "@controller/admin/teachers.controller.js";
import { useAdminStore } from "@store/admin.store.js";

import TeacherItem from "@components/common/UserItem.jsx";
import Header from "@components/common/Header.jsx";

const ManageTeachers = () => {
    const teachers = useAdminStore(state => state.teachers);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchTeachers().then(() => setLoading(false));
    }, []);

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Header title={"Manage Teachers"} />
            {loading && teachers.length == 0 && (
                <ActivityIndicator size="large" />
            )}
            <FlashList
                data={teachers}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.teacherId.toString()}
                className={"px-3"}
                contentContainerStyle={{ paddingVertical: 60 }}
                renderItem={({ item }) => (
                    <TeacherItem
                        item={item}
                        handlePress={() =>
                            router.push({
                                pathname: "(admin)/(others)//VerifyTeacher",
                                params: { teacherId: item.teacherId }
                            })
                        }
                    />
                )}
            />
        </View>
    );
};

export default ManageTeachers;
