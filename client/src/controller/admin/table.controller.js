import axios from "@utils/axios";
import { toast } from "@store/app.store";

/**
 * @param {string} option - the delete target id (e.g. "students", "attendance-records")
 * @param {"mongodb"|"turso"} db
 * @param {object} scope - optional scoping: { course, year, startDate, endDate }
 *   - course/year: restrict to a single class
 *   - startDate/endDate: restrict to a date range (YYYY-MM-DD)
 *   Omit/empty scope = delete everything in that target (unscoped).
 */
export const deleteAllDocsFromCollection = async (option, db, scope = {}) => {
    const { course, year, startDate, endDate } = scope;

    try {
        let response;

        if (db === "turso") {
            if (option === "users") {
                response = await axios.post(`/admin/clearAllUsers/`, {
                    role: "all"
                });
            } else if (option === "students") {
                response = await axios.post(`/admin/clearAllUsers/`, {
                    role: "students",
                    course,
                    year
                });
            } else if (option === "teachers") {
                response = await axios.post(`/admin/clearAllUsers/`, {
                    role: "teachers"
                });
            } else if (option === "parents") {
                response = await axios.post(`/admin/clearAllUsers/`, {
                    role: "parents"
                });
            } else {
                let table = option;
                if (table === "attendance-records") table = "attendance";

                response = await axios.post(`/admin/clearTable/`, {
                    table,
                    course,
                    year,
                    startDate,
                    endDate
                });
            }
        } else {
            response = await axios.post(`/admin/clearDbDocuments/`, {
                collection: option,
                course,
                year,
                startDate,
                endDate
            });
        }

        const deletedCount = response?.data?.deletedCount;

        toast.success(
            "Documents deleted successfully",
            typeof deletedCount === "number"
                ? `${deletedCount} record${deletedCount === 1 ? "" : "s"} removed`
                : ""
        );

        return { success: true, deletedCount };
    } catch (error) {
        toast.error(
            `Error deleting documents from ${option}`,
            error.response?.data?.message ?? ""
        );

        return { success: false, deletedCount: 0 };
    }
};
