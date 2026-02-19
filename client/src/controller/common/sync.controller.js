import { ToastAndroid } from "react-native";
import { useAppStore } from "@store/app.store.js";
import axios from "@utils/axios.js";

const handleTeacherData = (data) => {
    useAppStore.getState().updateUser({
        in_charge_year: data?.inCharge?.year,
        in_charge_course: data?.inCharge?.course,
        courses: data.courses ?? [],
        is_verified: data.is_verified,
    });
};

const handleStudentData = (data) => {
    console.log(data)
    useAppStore.getState().updateUser({
        rollno: data.rollno,
        course: data.course,
        year: data.year,
        is_verified: data.is_verified,
        courses: data.courses ?? [],
    });
};

const handleParentData = (data) => {
    useAppStore.getState().updateUser({
        is_verified: data.is_verified,
        students: data.students ?? [],
    });
};

const syncUser = async (user) => {
    try {
        user = user === "admin" ? "teacher" : user;
        const { data } = await axios.get(`/${user}/sync`);

        if (data.success) {
            if (user === "teacher" || user === "admin") handleTeacherData(data);
            else if (user === "student") handleStudentData(data);
            else if (user === "parent") handleParentData(data);
        } else {
            if (data?.type === "NOT_FOUND") useAppStore.getState().removeUser();
        }

        return {};
    } catch (error) {
        return {};
    }
};

export default syncUser;
