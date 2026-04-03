import axios from "@utils/axios";

import { useAppStore, toast } from "@store/app.store.js";

import { calendarData } from "@utils/calenderData";

export const getTodaysAttendanceReport = async (studentId = null) => {
    try {
        const res = await axios.post("/attendance/getTodaysAttendanceReport", {
            studentId
        });

        if (res.data.success) return res.data.attendance;
        else {
            toast.error("Syncing today's attendance failed");
            return {};
        }
    } catch (error) {
        toast.error("Syncing today's attendance failed", error.message ?? "");
        return {};
    }
};

export const getOverallAttendenceReport = async studentId => {
    try {
        const res = await axios.post("/attendance/overallAttendenceReport", {
            studentId
        });
        
        if (res.data.success) return res.data.report ?? {};
        return {};
    } catch (error) {
        if (error?.response) {
            toast.error(
                error.response?.data?.message ??
                    `Failed to fetching monthly attendance report!`
            );
        } else toast.error(`Failed to fetching monthly attendance report`);
        return {};
    }
};

export const getYearlyAttendenceReport = async year => {
    try {
        if (!year) return toast.error("invalid year", toast.SHORT);

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
            toast.error(
                "Failed to fetch yearly attendance report",
                res.data?.message ?? ""
            );
            return [];
        }
    } catch (error) {
        toast.error(`Failed to fetch yearly attendance report!`);
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
                    day.periods = report[day.date].periods;
                }
            });
            return data;
        } else {
            toast.error(
                "Generating attendance calendar report failed",
                res.data.message ?? ""
            );
            return data;
        }
    } catch (error) {
        toast.error(
            "Generating attendance calendar report failed",
            error.response?.data.message ?? ""
        );
        return data;
    }
};
