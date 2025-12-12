import { storage } from "@utils/storage.js";

export const setUser = ({
    userId,
    fullname,
    role,
    course = "",
    year_of_study = "",
    is_verified = false,
    rollno = ""
}) => {
    if (!role || !userId || !fullname) return;
    storage.set("userId", userId);
    storage.set("fullname", fullname);
    storage.set("role", role);

    if (course) storage.set("course", course);
    if (year_of_study) storage.set("year_of_study", year_of_study);
    if (
        typeof is_verified === "boolean" ||
        is_verified === 0 ||
        is_verified === 1
    )
        storage.set("is_verified", Boolean(is_verified));

    if (rollno) storage.set("rollno", rollno);
};

export const getUser = () => {
    const userId = storage.getString("userId") || "";
    const fullname = storage.getString("fullname") || "";
    const role = storage.getString("role") || "unknown";
    const course = storage.getString("course") || "";
    const year_of_study = storage.getString("year_of_study") || "";
    const is_verified = storage.getBoolean("is_verified");
    const rollno = storage.getString("rollno") || "";

    return {
        userId,
        fullname,
        role,
        course,
        year_of_study,
        is_verified,
        rollno
    };
};

export const clearUser = () => {
    storage.remove("userId");
    storage.remove("fullname");
    storage.remove("role");
    storage.remove("course");
    storage.remove("year_of_study");
};

