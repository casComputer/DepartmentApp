import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
} from "react-native";
import {
    useQuery
} from "@tanstack/react-query";

import {
    getTodaysAttendanceReport
} from "@controller/student/attendance.controller.js";

import {
    HOURS
} from "@constants/ClassAndCourses.js";

import {
    useAppStore
} from "@store/app.store.js";

const today = new Date();
const day = today.getDate();
const weekday = today.toLocaleString("en-US", {
    weekday: "long"
});
const month = today.toLocaleString("en-US", {
    month: "long"
});
const year = today.getFullYear();

const Bubble = ({
    item, attendance
}) => (
    <View
        style={ {
            backgroundColor:
            attendance?.[item.id] === "present"
            ? "rgb(34, 197, 94)": attendance?.[item.id] === "absent"
            ? "rgb(239, 68, 68)": "rgb(120, 129, 143)",
            borderRadius: "50%",
        }}
        className="w-8 h-8 justify-center items-center"
        >
        <Text className="text-white font-black text-xl">{item.key}</Text>
    </View>
);

const MiniAttentdenceCard = ({
    studentId = null
}) => {
    const {
        data: attendance
    } = useQuery( {
            queryKey: ["todaysAttendanceReport"],
            queryFn: ()=> getTodaysAttendanceReport(studentId),
        });

    const theme = useColorScheme();

    return (
        <View className="px-3 mt-12">
            <View
                style={ { boxShadow: "0 3px 4px rgba(0, 0, 0, 0.5)" }}
                className="w-full rounded-3xl overflow-hidden p-8 gap-8 bg-card"
                >
                {/* Top */}

                <View className="flex-row items-center">
                    <Text className="text-5xl font-bold text-text">{day}</Text>
                    <View className="ml-5">
                        <Text className="text-xl font-semibold text-text ">
                            {weekday}
                        </Text>
                        <Text className="text-md font-semibold text-text">
                            {month} {year}
                        </Text>
                    </View>
                </View>

                <View>
                    <Text className="text-black text-xl font-semibold text-text">
                        Todays Attendance
                    </Text>

                    <View className="flex-row items-center mt-4 gap-4">
                        {attendance &&
                        Object.keys(attendance).length === 0 &&
                        (weekday.toLowerCase() === "saturday" ||
                            weekday.toLowerCase() === "sunday") ? (
                            <Text className="text-2xl font-bold text-text">
                                Holiday 🎉
                            </Text>
                        ): (
                            HOURS.map((item) => (
                                <Bubble
                                    key={item.key}
                                    item={item}
                                    attendance={attendance}
                                    />
                            ))
                        )}
                        {!attendance && (
                            <ActivityIndicator
                                color={theme == "dark" ? "black": "white"}
                                />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const MiniAttentdence = ()=> {
    const role = useAppStore(state=> state.user.role)

    if (role === 'student') return <MiniAttentdenceCard />

    const students = useAppStore.getState().user.students

    console.log(students)

    return(
        <View className="flex-1 gap-4">
            {
            students.map(student => (<MiniAttentdenceCard studentId={student} />))
            }
        </View>
    )
}

export default MiniAttentdence