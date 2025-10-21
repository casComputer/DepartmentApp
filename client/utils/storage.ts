import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

export const setUserData = ({ username, fullname, role, course, year }) => {
    storage.set("username", username);
    storage.set("fullname", fullname);
    storage.set("role", role);
    storage.set("course", course);
    storage.set("year", year);
};

export const clearUser = () => {
    storage.remove("username");
    storage.remove("fullname");
    storage.remove("role");
    storage.remove("course");
    storage.remove("year");
};
