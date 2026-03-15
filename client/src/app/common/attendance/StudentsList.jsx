import {
    useQuery
} from "@tanstack/react-query";
import {
    FlashList
} from "@shopify/flash-list";
import {
    View,
    Text
} from "react-native";
import {
    useLocalSearchParams
} from 'expo-router'

import Loader from "@components/common/Loader";
import {
    getStudentList
} from "@controller/teacher/students.controller.js";

const StudentItem = ({
    item: student
}) =>(
    <View className="flex-row items-center px-5 py-3.5 bg-card border border-border rounded-xl gap-4">
        <View className="w-16 items-center py-1 px-2.5 bg-btn/20 border border-border rounded-md">
            <Text className="text-text text-lg font-bold tracking-wide">{student.rollno}</Text>
        </View>
        <Text className="text-text text-lg font-bold flex-1">{student.fullname}</Text>
    </View>
)


const ListHeader = () => (
    <View className="flex-row px-5 py-2 gap-4 mb-1">
        <Text className="text-text-secondary/70 text-xs font-bold uppercase tracking-widest w-16">
            Roll No
        </Text>
        <Text className="text-text-secondary/70 text-xs font-bold uppercase tracking-widest flex-1">
            Student Name
        </Text>
    </View>
);

const ErrorState = ({
    message
}) => (
    <View className="m-6 p-4 bg-red-500/10 border border-red-500/25 rounded-xl">
        <Text className="text-red-400 text-sm">{message}</Text>
    </View>
);

const EmptyState = ({
    course, year
}) => (
    <View className="items-center justify-center py-10">
        <Text className="text-text-secondary text-sm text-center">
            No students found for{" "}
            <Text className="text-btn font-semibold">{course}</Text>
            {" — Year "}
            <Text className="text-btn font-semibold">{year}</Text>.
        </Text>
    </View>
);

const ItemSeparator = () => <View className="h-1" />;

const StudentsList = () => {
    const {
        year,
        course
    } = useLocalSearchParams()

    const {
        data: students,
        isLoading,
        isError,
        error,
    } = useQuery( {
            queryKey: ["studentList", year, course],
            queryFn: () => getStudentList({
                year, course
            }),
        });


    if (isError) {
        return <ErrorState message={error?.message || "Failed to load students."} />;
    }

    return (
        <FlashList
            data={students ?? []}
            keyExtractor={(item) => String(item.rollno)}
            renderItem={({ item }) => <StudentItem item={item} />}
            estimatedItemSize={62}
            ListHeaderComponent={<ListHeader />}
            ListEmptyComponent={
            isLoading ?
            <Loader size={"large"} />:
            <EmptyState course={course} year={year} />
            }
            ItemSeparatorComponent={ItemSeparator}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={ {
                paddingBottom: 16
            }}
            className="bg-primary"
            />
    );
};

export default StudentsList;