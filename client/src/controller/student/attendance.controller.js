import axios from "@utils/axios";
import { ToastAndroid, Text } from "react-native";

import { useAppStore } from "@store/app.store.js";

import { calendarData } from "@utils/calenderData";

export const getTodaysAttendanceReport = async (studentId = null) => {
    try {
        const res = await axios.post("/attendance/getTodaysAttendanceReport", {
            studentId
        });

        if (res.data.success) return res.data.attendance;
        else {
            ToastAndroid.show(
                "Syncing today's attendance failed",
                ToastAndroid.LONG
            );
            return {};
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            `Syncing today's attendance failed: ${error.message}`,
            ToastAndroid.LONG
        );
        throw new Error(error.message);
    }
};

export const getOverallAttendenceReport = async studentId => {
    try {
        const res = await axios.post("/attendance/overallAttendenceReport", {
            studentId
        });

        if (res.data.success) return res.data.report ?? {};
        else return {};
    } catch (error) {
        console.error(error.message);
        ToastAndroid.show(
            `Failed to fetching monthly attendance report!`,
            ToastAndroid.LONG
        );
        return {};
    }
};

export const getYearlyAttendenceReport = async year => {
    try {
        if (!year) return ToastAndroid.show("invalid year", ToastAndroid.SHORT);

        const res = await axios.post("/attendance/getYearlyAttendanceReport", {
            year: year?.toString()
        });

        if (res.data.success) {
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];

            const rowMap = {};
            res.data.rows.forEach(row => {
                rowMap[parseInt(row.month, 10)] = row;
            });

            const report = months.map((label, index) => {
                const monthNumber = index + 1;

                return {
                    label,
                    value: rowMap[monthNumber]?.percentage ?? 0
                };
            });

            return report ?? [];
        } else {
            ToastAndroid.show(
                res.data?.message ??
                    `Failed to fetch yearly attendance report!`,
                ToastAndroid.LONG
            );
            return [];
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show(
            `Failed to fetch yearly attendance report!`,
            ToastAndroid.LONG
        );
        return [];
    }
};

export const generateAttendanceCalendarReport = async (
    month,
    year,
    studentId
) => {
    const data = calendarData(year, month - 1);
    try {
        const res = await axios.post(
            "/attendance/generateAttendanceCalendarReport",
            {
                studentId,
                month,
                year
            }
        );

        if (res.data.success) {
            const report = res.data.report;

            data.map(day => {
                if (report[day.date]) {
                    day.status = report[day.date].status;
                }
            });
            return data;
        } else {
            ToastAndroid.show(
                res.data.message ??
                    "Generating attendance calendar report failed",
                ToastAndroid.LONG
            );
            return data;
        }
    } catch (error) {
        ToastAndroid.show(
            error.response?.data.message ??
                `Generating attendance calendar report failed`,
            ToastAndroid.LONG
        );
        return data;
    }
};
