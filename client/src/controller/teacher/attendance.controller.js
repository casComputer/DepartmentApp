import axios from "@utils/axios.js";
import {
    router
} from "expo-router";

import {
    useAppStore,
    toast
} from "@store/app.store.js";
import {
    saveStudentsCount
} from "@utils/storage.js";

export const saveAttendance = async ({
    students,
    course,
    year,
    hour,
    attendanceId = null
}) => {
    try {
        const {
            userId,
            role
        } = useAppStore.getState().user;

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

            toast.success("Attendance saved successfully")

            router.back();
        } else {
            toast.error("Failed to save attendance!", response?.data?.message ?? "")
            return false;
        }
        return true;
    } catch (err) {
        toast.error("Failed to save attendance", err?.response?.data?.message ?? "")
        return false;
    }
};

export const getAttendanceHistoryByTeacherId = async ({
    pageParam, limit
}) => {
    try {
        const {
            data
        } = await axios.post(
            "/attendance/getAttandanceTakenByTeacher",
            {
                page: pageParam, limit
            }
        );

        if (data.success && data.attendance) {
            return {
                data: data.attendance,
                nextPage: data.nextPage,
                hasMore: data.hasMore
            }
        }

        toast.error("Failed to get attendance history", data?.message ?? "")
        return {
            data: [],
            nextPage: null,
            hasMore: false
        };
    } catch (error) {
        toast.error("Failed to get attendance history")
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
        saveStudentsCount( {
            count: numberOfStudents, year, course
        });

        return res.data;

    } catch (error) {
        toast.error("Failed to fetch students details for attendance")
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
        const {
            userId,
            role,
            in_charge_course,
            in_charge_year
        } =
        useAppStore.getState().user;

        if (role === "teacher") {
            course = in_charge_course;
            year = in_charge_year;
        }

        const {
            data
        } = await axios.post("/attendance/getClassAttendance", {
                course,
                year,
                page: pageParam,
                limit
            });

        if (data.success) return data;

        toast.error("Failed to fetch attendance", data.message ?? "")
    } catch (error) {
        toast.error("Failed to fetch attendance")
    }
};

export const getAttendanceXl = async payload => {
    try {
        const {
            data
        } = await axios.post(
            "/attendance/monthly-report-excel",
            payload
        );

        if (data.success) return data;

        if (data.filename) {
            return {
                ...data,
                success: true
            };
        }

        toast.error("Failed to generate attendance report!", data.message ?? "")

        return {
            success: false
        };
    } catch (error) {
        toast.error("Failed to generate attendance report")

        return {
            success: false
        };
    }
};

export const deleteReport = async payload => {
    try {
        const {
            data
        } = await axios.post("/attendance/deleteReport", payload);

        if (data.success)
            return {
            success: true,
            message:
            "Old reports deleted. You can now generate fresh reports."
        };

        toast.error("Failed to delete attendance report!", data.message ?? "")

        return {
            success: false
        };
    } catch (error) {
        toast.error("Failed to delete attendance report!")

        return {
            success: false
        };
    }
};