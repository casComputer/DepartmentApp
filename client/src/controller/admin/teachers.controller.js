import axios from "@utils/axios.js";
import {
    router
} from "expo-router";

import {
    useAppStore,
    toast
} from "@store/app.store.js";
import queryClient from "@utils/queryClient.js";

export const fetchTeachers = async () => {
    try {
        const response = await axios.get("/admin/teachers");

        return response.data ?? [];
    } catch (error) {
        toast.success("Failed to fetch teachets");
        return [];
    }
};

export const handleRemoveIncharge = async teacherId => {
    try {
        toast.info("please wait");
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
                    }: teacher
                )
            );
            toast.success(
                "Successfully removed in-charge"
            );
        } else
            toast.error("Failed to remove incharge");
    } catch (error) {
        toast.error("Failed to remove incharge");
    }
};

export const assignClass = async ({
    year, course, teacherId
}) => {
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
                    }: teacher
                )
            );

            if (teacherId === userId) {
                useAppStore.getState().updateUser({
                    in_charge_year: year.id,
                    in_charge_course: course.id
                });
            }

            toast.success(
                "Class assignment successfull"
            );
            router.back();
        } else
            toast.error(
            "Failed to assign class",
            res.data.message ?? ""

        );
    } catch (error) {
        toast.error("Failed to assign class");
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
                    }: teacher
                )
            );
        } else
            toast.error(
            "Failed to verify teacher",
            res.data?.message ?? ""
        );
    } catch (error) {
        toast.error("Failed to verify teacher");
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
            toast.error(
            "Failed to remove teacher",
            res.data?.message ?? ""
        );

        return res.data.success;
    } catch (error) {
        toast.error("Failed to remove teacher");
    }
};