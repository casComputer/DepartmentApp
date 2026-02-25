import { useAppStore } from "@store/app.store.js";
import axios from "@utils/axios.js";

export const generateOtp = async (email) => {
    try {
        const res = await axios.post("/email/generate", { email });
        return res.data.success ?? false;
    } catch (error) {
        return false;
    }
};

export const verifyOtp = async (otp) => {
    try {
        const res = await axios.post("/email/verify", { otp });

        console.log(res.data);

        useAppStore
            .getState()
            .updateUser({ is_email_verified: res.data.success ?? false });

        return res.data;
    } catch (error) {
        return (
            error.response?.data || {
                success: false,
                message: "Verification failed.",
            }
        );
    }
};
 