import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import { storage, clearUser } from "./storage";

// const url = process.env.EXPO_PUBLIC_API_BASE_URL;
const url = "http://10.35.94.212:3000"

console.log(url);

const api = axios.create({
    baseURL: url
});

api.interceptors.request.use(
    async config => {
        const token = storage.getString("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalReq = error.config;

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
                }

                const { data } = await axios.post(`${url}/auth/refresh`, {
                    refreshToken
                });

                storage.set("accessToken", data.accessToken);
                await SecureStore.setItemAsync(
                    "refreshToken",
                    data.refreshToken,
                    {
                        keychainAccessible: SecureStore.WHEN_UNLOCKED
                    }
                );

                originalReq.headers.Authorization = `Bearer ${data.accessToken}`;

                return api(originalReq);
            } catch (err) {
                console.error(err);
                storage.remove("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                clearUser();
                router.replace("/auth/Signin");
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
