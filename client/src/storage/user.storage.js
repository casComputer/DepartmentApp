import { storage } from "@utils/storage.js";

export const setUser = ({
    userId,
    fullname,
    role,

    in_charge_year = "",
    in_charge_course = "",

    is_verified = false,
    rollno = "",
    dp = "",
    dp_public_id = "",

    year_of_study = "",
    course = "",

    courses = []
}) => {
    if (!role || !userId || !fullname) return;
    storage.set("userId", userId);
    storage.set("fullname", fullname);
    storage.set("role", role);
    storage.set("dp", dp || "");
    storage.set("dp_public_id", dp_public_id || "");

    storage.set("year_of_study", year_of_study ?? "");
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
};

export const getUser = () => {
    const userId = storage.getString("userId") || "";
    const fullname = storage.getString("fullname") || "";
    const role = storage.getString("role") || "unknown";
    const dp = storage.getString("dp") || "";
    const dp_public_id = storage.getString("dp_public_id") || "";
    const is_verified = storage.getBoolean("is_verified");
    
    const rollno = storage.getString("rollno") || "";
    const course = storage.getString("course") || "";
    const year_of_study = storage.getString("year_of_study") || "";
    
    const in_charge_course = storage.getString("in_charge_course") || "";
    const in_charge_year = storage.getString("in_charge_year") || "";
    const courses = JSON.parse(storage.getString("courses") || "[]");

    return {
        userId,
        fullname,
        role,
        dp_public_id,
        dp,
        is_verified,
        
        rollno,
        course, 
        year_of_study,
        
        in_charge_course,
        in_charge_year,
        courses
        
    };
};

export const updateIncharge = incharge => {
    alert("🚨");
    // storage.set('in_charge', JSON.stringify(incharge ?? {}))
};

export const clearUser = () => {
    storage.remove("userId");
    storage.remove("fullname");
    storage.remove("role");
    storage.remove("dp");
    storage.remove("dp_public_id");
    storage.remove("is_verified");
    
    storage.remove("rollno");
    storage.remove("course");
    storage.remove("year_of_study");
    
    storage.remove("in_charge_course");
    storage.remove("in_charge_year");
    storage.remove("courses");
};
