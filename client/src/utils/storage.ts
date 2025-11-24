import { createMMKV } from "react-native-mmkv";

import { useAppStore } from "../store/app.store";

export const storage = createMMKV();
const updateUser = useAppStore.getState().updateUser;

type UserData = {
    userId: string;
    fullname: string;
    role: "student" | "teacher" | "parent" | "admin" | "unknown";
    course: string;
    year_of_study: string;
};

export const setUser = ({
    userId,
    fullname,
    role,
    course = "",
    year_of_study = ""
}: UserData) => {
    if (!role) return;

    storage.set("userId", userId);
    storage.set("fullname", fullname);
    storage.set("role", role);
    storage.set("course", course);
    storage.set("year", year_of_study);
    updateUser({ userId, fullname, role, course, year_of_study });
};

export const getUser = () => {
    const userId = storage.getString("userId") || "";
    const fullname = storage.getString("fullname") || "";
    const role = (storage.getString("role") as UserData["role"]) || "unknown";
    const course = storage.getString("course") || "";
    const year_of_study = storage.getString("year_of_study") || "";

    return {
        userId,
        fullname,
        role,
        course,
        year_of_study
    };
};

export const clearUser = () => {
    storage.remove("userId");
    storage.remove("fullname");
    storage.remove("role");
    storage.remove("course");
    storage.remove("year_of_study");
    useAppStore.getState().removeUser();
};

updateUser(getUser());

export const bulkAssignRollNumbers = ({ assignedList, key }) => {
    const raw = storage.getString(key);
    if (!raw) return false;

    let students = JSON.parse(raw);

    const assignedMap = {};
    assignedList.forEach(item => {
        assignedMap[item.studentId] = item.rollno;
    });

    students = students.map(st => ({
        ...st,
        rollno: assignedMap[st.studentId] ?? null
    }));

    storage.set(key, JSON.stringify(students));
    return true;
};

/*
=======
common
=======
userId
fullname
role
course
year_of_study

========
TEACHER
========
students
in_charge

*/
