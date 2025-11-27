import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";
import { saveStudentsCount } from "@utils/storage.js";

export const saveAttendance = async ({ students, course, year, hour }) => {
    try {
        const teacherId = useAppStore.getState().user?.userId;

        if (!teacherId) return;

        const response = await axios.post("/attendance/save", {
            attendance: students,
            course,
            year,
            teacherId,
            hour
        });

        if (response.data.success) {
            ToastAndroid.show(
                "Attendance saved successfully",
                ToastAndroid.SHORT
            );
        } else {
            ToastAndroid.show("Failed to save attendance", ToastAndroid.LONG);
            return false;
        }

        return true;
    } catch (err) {
        if (err?.response?.data?.message) {
            ToastAndroid.show(err?.response?.data?.message, ToastAndroid.LONG);
        } else {
            console.error("Error saving attendance:", err);
            ToastAndroid.show("Failed to save attendance", ToastAndroid.LONG);
        }
        return false;
    }
};

export const getAttendanceHistoryByTeacherId = async ({ pageParam, limit }) => {
    try {
        const teacherId = useAppStore.getState().user?.userId;

        const { data } = await axios.post(
            "/attendance/getAttandanceTakenByTeacher",
            { teacherId, page: pageParam, limit }
        );

        if (data.success && data.attendance) {
            return {
                data: data.attendance,
                nextPage: data.nextPage,
                hasMore: data.hasMore
            };
        } else
            return {
                data: [],
                nextPage: null,
                hasMore: false
            };
    } catch (error) {
        console.log("Error while getting attendance history: ", error);
        ToastAndroid.show(
            "Failed to get attendance history",
            ToastAndroid.LONG
        );
        return {
            data: [],
            nextPage: null,
            hasMore: false
        };
    }
};

export const fetchStudentsForAttendance = async ({ course, year }) => {
    try {
        const res = await axios.post("/attendance/fetchStudentsForAttendance", {
            course,
            year
        });

        const numberOfStudents = res.data?.numberOfStudents;
        saveStudentsCount({ count: numberOfStudents, year, course });

        return res.data;
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
        return 0;
    }
};
