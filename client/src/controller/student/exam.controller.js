import axios from "@utils/axios.js"
import {
    ToastAndroid
} from "react-native"

export const handleSaveResultDetails = async(data)=> {
    try {
        const res = await axios.post('/student/saveExamResultDetails', {
            data
        })

        if (res.data.success)
            ToastAndroid.show("Exam result uploaded successfull ✨", ToastAndroid.SHORT)
        else
            ToastAndroid(res.data.message ?? 'Failed to upload exam result!', ToastAndroid.LONG)

    } catch(e) {
        ToastAndroid('Failed to upload exam result!', ToastAndroid.LONG)
        console.log(e)
    }
}