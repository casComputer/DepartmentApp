import axios from "@utils/axios.js";
import { ToastAndroid } from "react-native";

import { useAppStore } from "@store/app.store.js";

export const save = async ({ list }) => {
    try {
        
        console.log(list);
        const { data } = await axios.post("/teacher/addCourse", { list });
        
        console.log(data);
        if (data.success) {
            ToastAndroid.show(
                "Courses updated successfull",
                ToastAndroid.SHORT
            );
            useAppStore.getState().updateUser({ courses: list });
        } else
            ToastAndroid.show(
                data?.message ?? "Courses updated successfull",
                ToastAndroid.LONG
            );
    } catch (error) {
        ToastAndroid.show("Courses updation failed!", ToastAndroid.LONG);
    }
};
