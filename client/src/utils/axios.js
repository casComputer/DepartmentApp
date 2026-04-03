import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";

import { storage } from "./storage";
import { useAppStore, useToastStore } from "@store/app.store.js";

const clearUser = useAppStore.getState().removeUser;

// SERVER PRIORITY
const SERVERS = [
    "https://dc-connect.onrender.com",
    "https://dc-connect.vercel.app",
    "https://departmentapp-production.up.railway.app"
];

let currentServerIndex = 0;

function getServerName(url) {
    if (url.includes("railway")) return "Railway";
    if (url.includes("render")) return "Render";
    if (url.includes("vercel")) return "Vercel";
    return "Backup server";
}

const api = axios.create({
    baseURL: SERVERS[currentServerIndex],
    timeout: 10000
});

// ================= REQUEST =================
api.interceptors.request.use(config => {
    const token = storage.getString("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ================= RESPONSE =================
api.interceptors.response.use(
    res => {
        // ✅ Remember last working server
        const baseURL = res.config.baseURL;
        const index = SERVERS.findIndex(s => baseURL?.includes(s));

        if (index !== -1) currentServerIndex = index;

        return res;
    },
    async error => {
        const originalReq = error.config;
        const status = error.response?.status;

        // جلوگیری infinite loop
        if (originalReq._handled) {
            return Promise.reject(error);
        }
        originalReq._handled = true;

        const isTimeout = error.code === "ECONNABORTED";
        const isNetworkError = !error.response && !isTimeout;
        const isServerError = [500, 502, 503, 504].includes(status);

        // ================= TIMEOUT (Render cold start) =================
        if (isTimeout) {
            originalReq._timeoutRetry = originalReq._timeoutRetry || 0;

            if (originalReq._timeoutRetry < 2) {
                originalReq._timeoutRetry++;

                useToastStore.getState()._add("info", "Server waking up...");

                await new Promise(r => setTimeout(r, 3000));

                return api(originalReq);
            }
        }

        // ================= SWITCH SERVER =================
        const shouldSwitch =
            isNetworkError ||
            isServerError ||
            (isTimeout && originalReq._timeoutRetry >= 2);

        if (shouldSwitch) {
            originalReq._retryCount = originalReq._retryCount || 0;

            if (originalReq._retryCount < SERVERS.length - 1) {
                originalReq._retryCount++;

                const nextServer = SERVERS[originalReq._retryCount];
                originalReq.baseURL = nextServer;

                useToastStore
                    .getState()
                    ._add(
                        "warning",
                        `Switching to ${getServerName(nextServer)}`
                    );

                return api(originalReq);
            }

            useToastStore
                .getState()
                ._add("error", "All servers are unavailable.");

            return Promise.reject(error);
        }

        // ================= RATE LIMIT =================
        if (status === 429) {
            const retryAfter = error.response?.headers?.["retry-after"] || 60;

            Alert.alert(
                "Rate Limit Exceeded",
                `Wait ${retryAfter} seconds before retrying.`
            );

            return Promise.reject(error);
        }

        // ================= AUTH REFRESH =================
        if ((status === 401 || status === 403) && !originalReq._authRetry) {
            originalReq._authRetry = true;

            try {
                const refreshToken =
                    await SecureStore.getItemAsync("refreshToken");

                if (!refreshToken) return logout();

                for (let server of SERVERS) {
                    try {
                        const { data } = await axios.post(
                            `${server}/auth/refresh`,
                            { refreshToken },
                            { timeout: 5000 }
                        );

                        storage.set("accessToken", data.accessToken);

                        originalReq.headers.Authorization = `Bearer ${data.accessToken}`;
                        originalReq.baseURL = server;

                        useToastStore
                            .getState()
                            ._add(
                                "info",
                                `Session restored via ${getServerName(server)}`
                            );

                        return api(originalReq);
                    } catch {}
                }

                return logout();
            } catch {
                return logout();
            }
        }

        return Promise.reject(error);
    }
);

// ================= LOGOUT =================
async function logout() {
    storage.remove("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    clearUser();

    useToastStore
        .getState()
        ._add("error", "Session expired. Please login again.");
}

export default api;
