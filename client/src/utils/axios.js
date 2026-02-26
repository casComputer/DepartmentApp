import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";

import { storage } from "./storage";
import { clearUser } from "@storage/user.storage.js";

let url = "https://dc-connect.onrender.com";
// url = "http://192.168.0.132:3000"; // 5g 
// url = "http://10.63.31.150:3000"; // 

const api = axios.create({
    baseURL: url,
});

api.interceptors.request.use(
    async (config) => {
        const token = storage.getString("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalReq = error.config;

        if (error.response?.status === 429) {
            const retryAfter = error.response.headers["retry-after"] || 60;
            const message =
                error.response.data?.error ||
                "Too many requests. Please try again later.";

            Alert.alert(
                "Rate Limit Exceeded",
                `${message}\n\nPlease wait ${retryAfter} seconds before trying again.`,
                [{ text: "OK" }],
            );

            return Promise.reject(error);
        }

        if (
            (error.response?.status === 403 ||
                error.response?.status === 401) &&
            !originalReq._retry
        ) {
            originalReq._retry = true;

            try {
                const refreshToken =
                    await SecureStore.getItemAsync("refreshToken");
                if (!refreshToken) {
                    storage.remove("accessToken");
                    await SecureStore.deleteItemAsync("refreshToken");
                    clearUser();
                    router.replace("/auth/Signin");
                }

                const { data } = await axios.post(`${url}/auth/refresh`, {
                    refreshToken,
                });

                storage.set("accessToken", data.accessToken);

                // ======= temporary removed token rotaion =======
                // await SecureStore.setItemAsync(
                //     "refreshToken",
                //     data.refreshToken,
                //     {
                //         keychainAccessible: SecureStore.WHEN_UNLOCKED
                //     }
                // );

                originalReq.headers.Authorization = `Bearer ${data.accessToken}`;

                return api(originalReq);
            } catch (err) {
                console.error(
                    "Refresh error:",
                    err.response?.status,
                    err.message,
                );

                // Only logout if refresh token is invalid/expired
                const status = err.response?.status;

                if (status === 401 || status === 403) {
                    storage.remove("accessToken");
                    await SecureStore.deleteItemAsync("refreshToken");
                    clearUser();
                    router.replace("/auth/Signin");
                    return Promise.reject(err);
                }

                // Otherwise server/network error
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
