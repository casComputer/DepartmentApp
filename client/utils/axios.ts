import "dotenv/config";
import axios from "axios";

import { storage } from "../utils/storage.ts";

const url = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: url
});

api.interceptors.request.use(
    async config => {
        const token = storage["accessToken"];
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

        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;

            try {
                const refreshToken = storage["refreshToken"];
                if (!refreshToken) throw new Error("No refresh token.");

                const { data } = await axios.post(`${url}/auth/refresh`, {
                    refreshToken
                });

                storage["accessToken"] = data.accessToken;
                storage["refreshToken"] = data.refreshToken;

                originalReq.headers.Authorization = `Bearer ${data.accessToken}`;

                return api(originalReq);
            } catch (err) {
                storage["accessToken"] = "";
                storage["refreshToken"] = "";
                // log out logic here
                
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
