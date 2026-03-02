import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";
import { router } from "expo-router";

import { useAppStore } from "@store/app.store.js";
import queryClient from "@utils/queryClient.js";

export const fetchTeachers = async () => {
    try {
        const response = await axios.get("/admin/teachers");

        return response.data ?? [];
    } catch (error) {
        ToastAndroid.show("Failed to fetch teachets", ToastAndroid.SHORT);
        return [];
    }
};

export const handleRemoveIncharge = async teacherId => {
    try {
        ToastAndroid.show("please wait", ToastAndroid.SHORT);
        const response = await axios.post("/admin/removeIncharge", {
            teacherId
        });

        if (response.data.success) {
            queryClient.setQueryData(["teachers"], oldData =>
                oldData?.map(teacher =>
                    teacher.userId === teacherId
                        ? {
                              ...teacher,
                              in_charge_course: null,
                              in_charge_year: null
                          }
                        : teacher
                )
            );
            ToastAndroid.show(
                "Successfully removed in-charge",
                ToastAndroid.SHORT
            );
        } else
            ToastAndroid.show("Failed to remove incharge", ToastAndroid.LONG);
    } catch (error) {
        console.log(error);
        ToastAndroid.show("Failed to remove incharge", ToastAndroid.LONG);
    }
};

export const assignClass = async ({ year, course, teacherId }) => {
    try {
        const res = await axios.post("/admin/assignClass", {
            year: year.id,
            course: course.id,
            teacherId
        });

        if (res.data.success) {
            const userId = useAppStore.getState().user.userId;

            queryClient.setQueryData(["teachers"], oldData =>
                oldData?.map(teacher =>
                    teacher.userId === teacherId
                        ? {
                              ...teacher,
                              in_charge_course: course.id,
                              in_charge_year: year.id
                          }
                        : teacher
                )
            );

            if (teacherId === userId) {
                useAppStore.getState().updateUser({
                    in_charge_year: year.id,
                    in_charge_course: course.id
                });
            }

            ToastAndroid.show(
                "Class assigned successfully",
                ToastAndroid.SHORT
            );

            router.back();
        } else
            ToastAndroid.show(
                res.data.message ?? "failed to assign class",
                ToastAndroid.LONG
            );
    } catch (error) {
        ToastAndroid.show("failed to assign class", ToastAndroid.LONG);
    }
};

export const verifyTeacher = async teacherId => {
    try {
        const res = await axios.post("/admin/verifyTeacher", {
            teacherId
        });

        if (res.data.success) {
            queryClient.setQueryData(["teachers"], oldData =>
                oldData?.map(teacher =>
                    teacher.userId === teacherId
                        ? {
                              ...teacher,
                              is_verified: true
                          }
                        : teacher
                )
            );
        } else
            ToastAndroid.show(
                res.data?.message ?? "Failed to verify teacher",
                ToastAndroid.LONG
            );
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to verify teacher", ToastAndroid.LONG);
    }
};

export const cancelVerification = async teacherId => {
    try {
        const res = await axios.post("/admin/deleteTeacher", {
            teacherId
        });

        if (res.data?.success)
            queryClient.setQueryData(["teachers"], oldData =>
                oldData?.filter(teacher => teacher.userId !== teacherId)
            );
        else
            ToastAndroid.show(
                res.data?.message ?? "Failed to remove teacher",
                ToastAndroid.LONG
            );

        return res.data.success;
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Failed to remove teacher", ToastAndroid.LONG);
    }
};
