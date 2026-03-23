import axios from "@utils/axios.js";
import {
    toast
} from '@store/app.store'

export const fetchAllTeachers = async () => {
    try {
        const {
            data
        } = await axios.post("/teacher/fetchAllTeachers");

        if (data.success) return data.teachers;
        else {
            toast.error("Failed to fetch teachers", data.message ?? '')
            return []
        }
    } catch (err) {
        toast.error('Failed to fetch teachers')
        return [];
    }
};