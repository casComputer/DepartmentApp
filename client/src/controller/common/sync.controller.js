import { ToastAndroid } from "react-native";
import { useAppStore } from "@store/app.store.js";
import axios from "@utils/axios.js";

const handleTeacherData = data => {
    const in_charge_course = useAppStore.getState()?.user.in_charge_course;
    const in_charge_year = useAppStore.getState()?.user.in_charge_year;

    if (
        in_charge_course !== data.in_charge_course ||
        in_charge_year !== data.in_charge_year
    )
        useAppStore.getState().updateUser({
            in_charge_year: data?.inCharge?.year,
            in_charge_course: data?.inCharge?.course
        });

    useAppStore.getState().updateUser({
        courses: data.courses ?? []
    });
};

const handleStudentData = data => {
    useAppStore.getState().updateUser({
        rollno: data.rollno,
        course: data.course,
        year: data.year,
        is_verified: data.is_verified,
        courses: data.courses ?? []
    });
};

const handleParentDaat = data => {
    useAppStore.getState().updateUser({
        is_verified: data.is_verified,
        students: data.students ?? []
    });
};

const syncUser = async user => {
    try {
        user = user === "admin" ? "teacher" : user;
        const { data } = await axios.get(`/${user}/sync`);

        if (data.success) {
            if (user === "teacher" || role === "admin") handleTeacherData(data);
            else if (user === "student") handleStudentData(data);
            else if (user === "parent") handleParentDaat(data);
        } else {
            if (data?.type === "NOT_FOUND") useAppStore.getState().removeUser();

            ToastAndroid.show(
                data?.message ?? "Failed to sync user data",
                ToastAndroid.LONG
            );
        }

        return {};
    } catch (error) {
        ToastAndroid.show("Failed to sync user data", ToastAndroid.LONG);
        return {};
    }
};

export default syncUser;
