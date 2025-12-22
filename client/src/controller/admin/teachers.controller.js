import axios from "@utils/axios.js";
import { router } from "expo-router";

import { useAdminStore } from "@store/admin.store.js";
import { ToastAndroid } from "react-native";

export const fetchTeachers = async () => {
    try {
        const response = await axios.get("/admin/teachers");

        const setTeachers = useAdminStore.getState().setTeachers;
        setTeachers(response.data);

        return response.data;
    } catch (error) {
        console.error("Error fetching teachers:", error.message);
        throw error;
    }
};

export const assignClass = async ({ year, course, teacherId }) => {
    try {
        const res = await axios.post("/admin/assignClass", {
            year: year.id,
            course: course.id,
            teacherId,
        });

        if (res.data.success) {
            const setInCharge = useAdminStore.getState().setInCharge;
            setInCharge(teacherId, year.id, course.id);
            router.back();
        } else
            ToastAndroid.show(
                res.data.message ?? "failed to assign class",
                ToastAndroid.LONG
            );
    } catch (error) {
        console.error(error);
        ToastAndroid.show("failed to assign class", ToastAndroid.LONG);
    }
};

export const verifyTeacher = async (teacherId) => {
    try {
        const res = await axios.post("/admin/verifyTeacher", { teacherId });

        if (res.data.success) {
            const verifyTeacher = useAdminStore.getState().verifyTeacher;
            verifyTeacher(teacherId);
        }
    } catch (error) {
        console.error(error);
    }
};

export const cancelVerification = async (teacherId) => {
    try {
        const res = await axios.post("/admin/deleteTeacher", { teacherId });

        return res.data.success;
    } catch (error) {
        console.error(error);
    }
};
