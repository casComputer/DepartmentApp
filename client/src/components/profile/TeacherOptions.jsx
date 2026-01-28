import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useAppStore } from "@store/app.store.js";

const routeToAddCourse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/common/profile/AddCourse");
};

const CourseList = ({ courses }) => {
    return (
        <>
            <Text className="text-2xl font-bold text-text px-2 py-4">
                My Courses
            </Text>
            <View className="flex-row flex-wrap gap-2 ">
                {courses.map((course, index) => (
                    <View key={index} className="px-4 py-3 rounded-3xl bg-card">
                        <Text className="text-md font-bold text-text">
                            {course.course_name} {course.year} {course.course}
                        </Text>
                    </View>
                ))}
                <TouchableOpacity
                    onPress={routeToAddCourse}
                    activeOpacity={0.8}
                    className="px-4 py-3 rounded-3xl bg-card flex-row justify-center items-center gap-1"
                >
                    <Feather name="edit" size={16} color="rgb(59, 130, 246)" />
                    <Text className="text-md font-bold text-blue-500">
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export const TeacherOptions = () => {
    const courses = useAppStore(state => state.user?.courses);

    console.log(courses)

    
    return (
        <View className="px-2">
            {!!courses?.length ? (
                <CourseList courses={courses} />
            ) : (
                <TouchableOpacity
                    onPress={routeToAddCourse}
                    className="py-4 rounded-3xl items-center justify-center bg-btn"
                >
                    <Text className="text-xl font-bold text-text text-center">
                        Add Your Course
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
