import axios from "@utils/axios";

import { ToastAndroid } from "react-native";

export const deleteAllDocsFromCollection = async (option, db) => {
    try {
        if (db === "turso") {
            if (option === "users") {
                await axios.post(`/admin/clearAllUsers/`, { role: "all" });
            } else if (option === "students") {
                await axios.post(`/admin/clearAllUsers/`, { role: "students" });
            } else if (option === "teachers") {
                await axios.post(`/admin/clearAllUsers/`, { role: "teachers" });
            } else if (option === "parents") {
                await axios.post(`/admin/clearAllUsers/`, { role: "parents" });
            } else {
                if (option === "attendance-records") {
                    option = "attendance";
                }
                await axios.post(`/admin/clearTable/`, { table: option });
            }
        } else {
            await axios.post(`/admin/clearDbDocuments/`, {
                collection: option
            });
        }
        ToastAndroid.show(
            "Documents deleted successfully!",
            ToastAndroid.SHORT
        );
        return true;
    } catch (error) {
        ToastAndroid.show(
            error.response?.data?.message ??
                "Error deleting documents from ${option}",
            ToastAndroid.LONG
        );
        return false;
    }
};
