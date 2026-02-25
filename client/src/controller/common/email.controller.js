import { ToastAndroid } from "react-native";
import { useAppStore } from "@store/app.store.js";
import axios from "@utils/axios.js";

export const generateOtp = async email => {
    try {
        console.log('generating...');
        const res = await axios.post("/email/generate", { email });
        console.log(res.data);
    } catch (error) {
        console.error(error);
    }
};

export const verifyOtp = async otp => {
    try {
        const res = await axios.post("/email/verfiy", { otp });

        console.log(res.data);
    } catch (error) {
        console.error(error);
    }
};
