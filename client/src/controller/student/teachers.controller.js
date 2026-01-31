import axios from "@utils/axios.js";
import { ToastAndroid } from 'react-native'

export const fetchAllTeachers = async () => {
    try {
        const { data } = await axios.post("/teacher/fetchAllTeachers");

        if (data.success) return data.teachers;
        else {
           ToastAndroid.show(data.message ?? 'Failed to fetch teachers!', ToastAndroid.LONG)
           return []
        }
    } catch (err) {
           ToastAndroid.show('Failed to fetch teachers!', ToastAndroid.LONG)
        return [];
    }
};
