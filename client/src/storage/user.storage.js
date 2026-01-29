import {
    storage
} from "@utils/storage.js";

export const setUser = ({
    userId,
    fullname,
    role,
    is_verified = false,
    dp = "",
    dp_public_id = "",

    phone = "",
    email = "",
    about = "",

    // For teachers
    in_charge_year = "",
    in_charge_course = "",
    courses = [],

    // For students
    rollno = "",
    course = "",
    year = "",

    // For parents
    students = []
}) => {
    if (!role || !userId || !fullname) return;
    storage.set("userId", userId);
    storage.set("fullname", fullname);
    storage.set("role", role);
    storage.set("dp", dp || "");
    storage.set("dp_public_id", dp_public_id || "");
    storage.set("phone", phone || "");
    storage.set("email", email || "");
    storage.set("about", about || "");

    storage.set("year", year ?? "");
    storage.set("course", course ?? "");

    storage.set("in_charge_course", in_charge_course || "");
    storage.set("in_charge_year", in_charge_year || "");
    storage.set("courses", JSON.stringify(courses || []));

    if (
        typeof is_verified === "boolean" ||
        is_verified === 0 ||
        is_verified === 1
    )
        storage.set("is_verified", Boolean(is_verified));

    if (rollno) storage.set("rollno", rollno);

    if (students && students?.length)
        storage.set("students", JSON.stringify(students || []));
};

export const getUser = () => {
    const userId = storage.getString("userId") || "";
    const fullname = storage.getString("fullname") || "";
    const role = storage.getString("role") || "unknown";
    const dp = storage.getString("dp") || "";
    const dp_public_id = storage.getString("dp_public_id") || "";
    const is_verified = storage.getBoolean("is_verified");
    const phone = storage.getString("phone") || "";
    const email = storage.getString("email") || "";
    const about = storage.getString("about") || "";

    // student
    const rollno = storage.getString("rollno") || "";
    const course = storage.getString("course") || "";
    const year = storage.getString("year") || "";

    // teacher
    const in_charge_course = storage.getString("in_charge_course") || "";
    const in_charge_year = storage.getString("in_charge_year") || "";
    const courses = JSON.parse(storage.getString("courses") || "[]");

    // parent
    const students = JSON.parse(storage.getString("students") || "[]");

    if (role === 'student') {
        return {
            userId,
            fullname,
            role,
            dp_public_id,
            dp,
            is_verified,
            phone,
            email,
            about,
            rollno,
            course,
            year,
        };
    } else if (role === 'teacher' || role === 'admin') {
        return {
            userId,
            fullname,
            role,
            dp_public_id,
            dp,
            is_verified,
            phone,
            email,
            about,
            in_charge_course,
            in_charge_year,
            courses
        };
    } else if (role === 'parent') {
        return {
            userId,
            fullname,
            role,
            dp_public_id,
            dp,
            is_verified,
            phone,
            email,
            about,
            students
        };
    }
};


export const clearUser = () => {
    storage.remove("userId");
    storage.remove("fullname");
    storage.remove("role");
    storage.remove("dp");
    storage.remove("dp_public_id");
    storage.remove("is_verified");
    storage.remove("phone");
    storage.remove("email");
    storage.remove("about");

    storage.remove("rollno");
    storage.remove("course");
    storage.remove("year");

    storage.remove("in_charge_course");
    storage.remove("in_charge_year");
    storage.remove("courses");

    storage.remove("students");
};