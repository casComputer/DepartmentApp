import axios from "@utils/axios.js";
import {
    useAppStore,
    toast
} from "@store/app.store.js";

export const saveWorklog = async ({
    year,
    course,
    date,
    hour,
    subject,
    topics
}) => {
    try {
        if (
            !year ||
            !course ||
            !date ||
            !hour ||
            !subject ||
            topics.length === 0
        ) {
            return toast.warn("All fields are required to save the worklog.");
        }

        const user = useAppStore.getState().user;

        const worklogData = {
            year,
            course,
            date,
            hour,
            subject,
            topics,
            teacherId: user.userId
        };
        const response = await axios.post("/teacher/saveWorklog", worklogData);

        if (response.data.success) {
            toast.success(
                "Worklog saved successfully.",
            );
        }
        toast.error(
            "Failed to save Worklog",
            response.data.message ?? ""
        );
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            toast.error(
                "Failed to save Worklog",
                error.response.data.message ?? ""
            );
        } else {
            toast.error(
                "Failed to save Worklog",
                error.response.data.message ?? ""
            );

        }
    }
};

export const fetchWorklogs = async page => {
    try {
        const user = useAppStore.getState().user;

        const response = await axios.post("/teacher/getWorklogs", {
            teacherId: user.userId,
            page,
            limit: 5
        });

        if (response.data.success)
            return response.data;

        toast.error(
            "Failed to fetch Worklog",
            response.data.message ?? "",
        );
        return {
            data: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    } catch (error) {
        toast.error("Failed to fetch Worklog");
        return {
            data: [],
            hasMore: false,
            nextPage: undefined,
            success: false
        };
    }
};