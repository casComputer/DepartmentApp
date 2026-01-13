import { storage } from "@utils/storage.js";

export const setUser = ({
    userId,
    fullname,
    role,

    // in_charge_year = "",
    // in_charge_course = "",

    is_verified = false,
    rollno = "",
    dp = "",
    dp_public_id = ""
}) => {
    if (!role || !userId || !fullname) return;
    storage.set("userId", userId);
    storage.set("fullname", fullname);
    storage.set("role", role);
    storage.set("dp", dp || "");
    storage.set("dp_public_id", dp_public_id || "");
    // storage.set("in_charge_course", in_charge_course || "");
    // storage.set("in_charge_year", in_charge_year || "");

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
    const in_charge_course = storage.getString("in_charge_course") || "";
    const in_charge_year = storage.getString("in_charge_year") || "";
    const is_verified = storage.getBoolean("is_verified");
    const rollno = storage.getString("rollno") || "";
    const dp = storage.getString("dp") || "";
    const dp_public_id = storage.getString("dp_public_id") || "";

    return {
        userId,
        fullname,
        role,
        in_charge_course,
        in_charge_year,
        is_verified,
        rollno,
        dp_public_id,
        dp
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
    storage.remove("in_charge_course");
    storage.remove("in_charge_year");
    storage.remove("is_verified");
    storage.remove("rollno");
    storage.remove("dp");
    storage.remove("dp_public_id");
};
