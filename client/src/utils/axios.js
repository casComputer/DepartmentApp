import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";

import { storage } from "./storage";
import { useAppStore, useToastStore } from "@store/app.store.js";

const clearUser = useAppStore.getState().removeUser;

// 🔥 SERVER PRIORITY
const SERVERS = [
  "https://departmentapp-production.up.railway.app", // 🚆
  "https://dc-connect.onrender.com",                 // 🟡
  "https://dc-connect.vercel.app"                    // ⚡
];

// 🔥 Friendly names
function getServerName(url) {
  if (url.includes("railway")) return "Railway";
  if (url.includes("render")) return "Render";
  if (url.includes("vercel")) return "Vercel";
  return "Backup server";
}

const api = axios.create({
  baseURL: SERVERS[0],
  timeout: 10000
});

// ✅ Attach token
api.interceptors.request.use(async config => {
  const token = storage.getString("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  res => res,
  async error => {
    const originalReq = error.config;
    const status = error.response?.status;

    const serverFailure =
      !error.response ||
      [500, 502, 503, 504].includes(status);

    // 🔥 MULTI FALLBACK
    if (serverFailure) {
      originalReq._retryCount = originalReq._retryCount || 0;

      if (originalReq._retryCount < SERVERS.length - 1) {
        originalReq._retryCount++;

        const nextServer = SERVERS[originalReq._retryCount];
        originalReq.baseURL = nextServer;

        // ✅ Show toast only once
        if (originalReq._retryCount === 1) {
          useToastStore.getState()._add(
            "info",
            "Switching to backup server..."
          );
        }

        return api(originalReq);
      }

      // ❌ ALL SERVERS FAILED
      useToastStore.getState()._add(
        "error",
        "All servers are currently unavailable. Please try again later."
      );
    }

    // 🚫 RATE LIMIT
    if (status === 429) {
      const retryAfter = error.response?.headers?.["retry-after"] || 60;

      Alert.alert(
        "Rate Limit Exceeded",
        `Wait ${retryAfter} seconds before retrying.`
      );

      return Promise.reject(error);
    }

    // 🔐 TOKEN REFRESH (WITH FALLBACK)
    if ((status === 401 || status === 403) && !originalReq._authRetry) {
      originalReq._authRetry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

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

            useToastStore.getState()._add(
              "info",
              `Session restored via ${getServerName(server)}`
            );

            return api(originalReq);

          } catch (err) {

          }
        }

        // ❌ ALL REFRESH FAILED
        return logout();

      } catch (err) {
        return logout();
      }
    }

    return Promise.reject(error);
  }
);

// 🔥 LOGOUT
async function logout() {
  storage.remove("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  clearUser();

  useToastStore.getState()._add(
    "error",
    "Session expired. Please login again."
  );

  router.replace("/auth/Signin");
}

export default api;