import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  router
} from "expo-router";
import {
  Alert
} from "react-native";

import {
  storage
} from "./storage";
import {
  clearUser
} from "@storage/user.storage.js";

let PRIMARY_URL = process.env.EXPO_PUBLIC_PRIMARY_SERVER;
let BACKUP_URL = process.env.EXPO_PUBLIC_FALLBACK_SERVER;

const api = axios.create({
  baseURL: PRIMARY_URL,
  timeout: 10000
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
    const status = error.response?.status;

    const serverFailure =
    !error.response || [500,
      502,
      503,
      504,
      402].includes(status);

    // FALLBACK SERVER
    if (serverFailure && !originalReq._backupRetry && BACKUP_URL) {
      originalReq._backupRetry = true;

      originalReq.baseURL = BACKUP_URL;
      return axios(originalReq);
    }

    // RATE LIMIT
    if (status === 429) {
      const retryAfter = error.response.headers["retry-after"] || 60;

      Alert.alert(
        "Rate Limit Exceeded",
        `Please wait ${retryAfter} seconds before trying again.`,
        [{
          text: "OK"
        }]
      );

      return Promise.reject(error);
    }

    // TOKEN REFRESH
    if ((status === 401 || status === 403) && !originalReq._retry) {
      originalReq._retry = true;

      try {
        const refreshToken =
        await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          storage.remove("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          clearUser();
          router.replace("/auth/Signin");
          return Promise.reject(error);
        }

        const {
          data
        } = await axios.post(
          `${originalReq.baseURL}/auth/refresh`,
          {
            refreshToken
          }
        );

        storage.set("accessToken", data.accessToken);

        originalReq.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalReq);
      } catch (err) {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          storage.remove("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          clearUser();
          router.replace("/auth/Signin");
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;