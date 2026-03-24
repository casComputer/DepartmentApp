import axios from "@utils/axios";
import {
    toast
} from "@store/app.store";

export const deleteAllDocsFromCollection = async (option, db) => {
    try {
        if (db === "turso") {
            if (option === "users") {
                await axios.post(`/admin/clearAllUsers/`, {
                    role: "all"
                });
            } else if (option === "students") {
                await axios.post(`/admin/clearAllUsers/`, {
                    role: "students"
                });
            } else if (option === "teachers") {
                await axios.post(`/admin/clearAllUsers/`, {
                    role: "teachers"
                });
            } else if (option === "parents") {
                await axios.post(`/admin/clearAllUsers/`, {
                    role: "parents"
                });
            } else {
                if (option === "attendance-records") option = "attendance";
                
                await axios.post(`/admin/clearTable/`, {
                    table: option
                });
            }
        } else {
            await axios.post(`/admin/clearDbDocuments/`, {
                collection: option
            });
        }

        toast.success("Documents deleted successfully")
        return true;
    } catch (error) {
        toast.error(`Error deleting documents from ${option}`, error.response?.data?.message ?? "")

        return false;
    }
};