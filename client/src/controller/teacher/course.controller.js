import axios from "@utils/axios.js";
import {
    router
} from "expo-router";

import {
    useAppStore,
    toast
} from "@store/app.store.js";

export const save = async ({
    list
}) => {
    try {
        const {
            data
        } = await axios.post("/teacher/addCourse", {
                list
            });

        if (data.success) {
            toast.success(
                "Courses updated successfull",
                data?.message ?? ""
            );
            useAppStore.getState().updateUser({
                courses: list
            });

            router.back()
        } else {
            toast.error(
                "Courses updation failed",
                data?.message ?? ""
            );
        }
    } catch (error) {
        toast.error("Courses updation failed!");
    }
};