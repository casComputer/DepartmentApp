import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";
import { router } from "expo-router";

import { useAppStore } from "@store/app.store.js";
import { saveStudentsCount } from "@utils/storage.js";

export const saveAttendance = async ({
    students,
    course,
    year,
    hour,
    attendanceId = null
}) => {
    try {
        const { userId, role } = useAppStore.getState().user;

        const response = await axios.post("/attendance/save", {
            attendance: students,
            course,
            year,
            userId,
            role,
            attendanceId,
            hour
        });

        if (response.data.success) {
            ToastAndroid.show(
                response.data.message ?? "Attendance saved successfully",
                ToastAndroid.SHORT
            );
            router.back();
        } else {
            ToastAndroid.show(
                response.data.message ?? "Failed to save attendance",
                ToastAndroid.LONG
            );
            return false;
        }
        return true;
    } catch (err) {
        ToastAndroid.show(
            err?.response?.data?.message ?? "Failed to save attendance",
            ToastAndroid.LONG
        );
        router.back();

        return false;
    }
};

export const getAttendanceHistoryByTeacherId = async ({ pageParam, limit }) => {
    try {
        const { data } = await axios.post(
            "/attendance/getAttandanceTakenByTeacher",
            { page: pageParam, limit }
        );

        if (data.success && data.attendance)
            return {
                data: data.attendance,
                nextPage: data.nextPage,
                hasMore: data.hasMore
            };
        else
            return {
                data: [],
                nextPage: null,
                hasMore: false
            };
    } catch (error) {
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

export const fetchStudentsForAttendance = async ({
    course,
    year,
    hour,
    date
}) => {
    try {
        const res = await axios.post("/attendance/fetchStudentsForAttendance", {
            course,
            year,
            hour,
            date
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

export const getClassAttendance = async ({
    course,
    year,
    pageParam,
    limit
}) => {
    try {
        const { userId, role, in_charge_course, in_charge_year } =
            useAppStore.getState().user;

        if (role === "teacher") {
            course = in_charge_course;
            year = in_charge_year;
        }

        const { data } = await axios.post("/attendance/getClassAttendance", {
            userId,
            role,
            course,
            year,
            pageParam,
            limit
        });

        if (data.success) return data;
        else
            ToastAndroid.show(
                data.message ?? "Failed to fetch attendance",
                ToastAndroid.LONG
            );
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to fetch attendance", ToastAndroid.LONG);
    }
};

export const getAttendanceXl = async payload => {
    try {
        const { data } = await axios.post(
            "/attendance/monthly-report-excel",
            payload
        );

        console.log(data);
        if (data.success) return data;

        if (data.filename) {
            return {
                ...data,
                success: true
            };
        }

        ToastAndroid.show(
            data.message ?? "Failed to generate attendance report!",
            ToastAndroid.LONG
        );

        return {
            success: false
        };
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            "Failed to generate attendance report!",
            ToastAndroid.LONG
        );
        return {
            success: false
        };
    }
};

export const deleteReport = async payload => {
    try {
        const { data } = await axios.post("/attendance/deleteReport", payload);

        if (data.success)
            return {
                success: true,
                message:
                    "Old reports deleted. You can now generate fresh reports."
            };

        ToastAndroid.show(
            data.message ?? "Failed to delete attendance report!",
            ToastAndroid.LONG
        );

        return { success: false };
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            "Failed to delete attendance report!",
            ToastAndroid.LONG
        );
        return { success: false };
    }
};
