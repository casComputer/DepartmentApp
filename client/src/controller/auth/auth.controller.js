import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { storage } from "@utils/storage.js";
import { useAppStore } from "@store/app.store.js";

// SERVER PRIORITY (hardcoded)
const SERVERS = [
    "https://dc-connect.onrender.com",
    "https://dc-connect.vercel.app",
    "https://departmentapp-production.up.railway.app"
];

function getServerName(url) {
    if (url.includes("railway")) return "Railway";
    if (url.includes("render")) return "Render";
    if (url.includes("vercel")) return "Vercel";
    return "Server";
}

const authController = async data => {
    let lastError = null;

    for (let i = 0; i < SERVERS.length; i++) {
        const server = SERVERS[i];

        try {
            const res = await axios.post(
                `${server}/auth/${data.endpoint}`,
                data,
                { timeout: 10000 }
            );

            if (res?.data?.success) {
                const { refreshToken, accessToken, user } = res.data;

                await SecureStore.setItemAsync("refreshToken", refreshToken);
                storage.set("accessToken", accessToken);

                useAppStore.getState().setUser(user);

                return {
                    success: true,
                    message: `Authenticated via ${getServerName(server)}`
                };
            }

            lastError = "Invalid response from server";
        } catch (error) {
            const status = error.response?.status;
            const isTimeout = error.code === "ECONNABORTED";
            const isNetworkError = !error.response && !isTimeout;
            const isServerError = [500, 502, 503, 504].includes(status);

            // 💤 Handle Render cold start
            if (isTimeout) {
                try {
                    await new Promise(r => setTimeout(r, 3000));

                    const retry = await axios.post(
                        `${server}/auth/${data.endpoint}`,
                        data,
                        { timeout: 10000 }
                    );

                    if (retry?.data?.success) {
                        const { refreshToken, accessToken, user } = retry.data;

                        await SecureStore.setItemAsync(
                            "refreshToken",
                            refreshToken
                        );
                        storage.set("accessToken", accessToken);
                        useAppStore.getState().setUser(user);

                        return {
                            success: true,
                            message: `Authenticated via ${getServerName(server)}`
                        };
                    }
                } catch {}
            }

            // 🔁 Switch to next server only for real failures
            if (isNetworkError || isServerError || isTimeout) {
                lastError = `Failed on ${getServerName(server)}`;
                continue;
            }

            // ❌ Real API error (wrong credentials etc.)
            if (error.response) {
                return {
                    success: false,
                    message:
                        error.response.data?.error || `Server error (${status})`
                };
            }

            return {
                success: false,
                message:
                    "No response from server. Check your internet connection."
            };
        }
    }

    return {
        success: false,
        message:
            lastError || "All servers are unavailable. Please try again later."
    };
};

export default authController;
