import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.ts";

export const saveAttendance = async ({ students, course, year }) => {
	try {
		const teacherId = useAppStore.getState().user?.userId;

		if (!teacherId) return;

		const response = await axios.post("/attendance/save", {
			attendance: students,
			course,
			year,
			teacherId,
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
		console.error("Error saving attendance:", err);
		ToastAndroid.show("Failed to save attendance", ToastAndroid.LONG);
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
				hasMore: data.hasMore,
			};
		} else return [];
	} catch (error) {
		console.log("Error while getting attendance history: ", error);
		ToastAndroid.show("Failed to save attendance", ToastAndroid.LONG);
		return [];
	}
};
