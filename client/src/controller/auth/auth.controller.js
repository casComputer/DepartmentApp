import axios from "axios";
import * as SecureStore from 'expo-secure-store';

import { storage ,setUser } from "@utils/storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.20.90:3000";

let success = false,
    message = "";

const authController = async data => {
    try {
        const response = await axios.post(`${API_URL}/auth/${data.endpoint}`, {
            ...data
        });

        if (response?.data?.success) {
            const { refreshToken , accessToken, user } = response.data;
            await SecureStore.setItemAsync("refreshToken", refreshToken);
            storage.set("accessToken", accessToken)
            setUser({ ...user })

            success = true;
            message = "Authentication Successful";
        }
    } catch (error) {
        message = "An unexpected error occurred. Please try again.";
        success = false
        if (error.response) {
            if (error.response.data?.error) {
                message = error.response.data.error;
            } else if (typeof error.response.data === "string") {
                message = error.response.data;
            } else {
                message = `Server responded with status ${error.response.status}`;
            }
        } else if (error.request) {
            message =
                "No response from the server. Please check your network connection or please try again later.";
        } else {
            message = error.message;
        }
    } finally {
        return { success, message };
    }
};

export default authController;
