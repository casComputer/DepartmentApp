import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import { storage } from "./storage";
import { clearUser } from "@storage/user.storage.js";

let url = "https://dc-connect.onrender.com";
//  url = "http://10.118.225.11:3000";

console.log(url);

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
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalReq = error.config;

		if (
			(error.response?.status === 403 || error.response?.status === 401) &&
			!originalReq._retry
		) {
			originalReq._retry = true;

			try {
				const refreshToken = await SecureStore.getItemAsync("refreshToken");
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
				console.error("Refresh error:", err.response?.status, err.message);

				// Only logout if refresh token is invalid/expired
				const status = err.response?.status;

				if (status === 401 || status === 403) {
					console.log("Refresh token invalid → logging out");
					storage.remove("accessToken");
					await SecureStore.deleteItemAsync("refreshToken");
					clearUser();
					router.replace("/auth/Signin");
					return Promise.reject(err);
				}

				// Otherwise server/network error
				console.log("Server or network issue → do NOT log out");
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
