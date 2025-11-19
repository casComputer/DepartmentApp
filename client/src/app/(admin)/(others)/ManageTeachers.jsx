import { useState , useEffect} from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { fetchTeachers } from "@controller/admin/teachers.controller.js";
import { useAdminStore } from "@store/admin.store.js";

import TeacherItem from "@components/admin/TeacherItem";
import Header from "@components/admin/Header.jsx";

const ManageTeachers = () => {
    const teachers = useAdminStore((state) => state.teachers);
    const [loading, setLoading] =useState(false)

    useEffect(() => {
        setLoading(true)
        fetchTeachers()
        .then(() => setLoading(false))
    }, []);

    

    if (loading)
        return (
            <Text className="mt-12 w-full text-center font-black text-3xl text-black">
                loading...
            </Text>
        );

    return (
        <View className="flex-1 ">
            <FlashList
                data={teachers}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.teacherId.toString()}
                className={"px-3"}
                contentContainerStyle={{ paddingVertical: 60 }}
                ListHeaderComponent={() => <Header title={"Manage Teachers"} />}
                renderItem={({ item }) => (
                    <TeacherItem item={item} />
                )}
            />
        </View>
    );
};

export default ManageTeachers;
