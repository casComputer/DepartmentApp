import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";
import { router } from "expo-router";

import { useAppStore } from "@store/app.store.js";

export const save = async ({ list }) => {
    try {
        const { data } = await axios.post("/teacher/addCourse", { list });
        
        if (data.success) {
            ToastAndroid.show(
                data?.message ?? "Courses updated successfull",
                ToastAndroid.SHORT
            );
            useAppStore.getState().updateUser({ courses: list });
            router.back()
        } else
            ToastAndroid.show(
                data?.message ?? "Courses updation failed!",
                ToastAndroid.LONG
            );
    } catch (error) {
        ToastAndroid.show("Courses updation failed!", ToastAndroid.LONG);
    }
};
