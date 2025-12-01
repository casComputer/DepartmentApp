import { create } from "zustand";

import {
    setUser as saveUserToStorage,
    clearUser
} from "@storage/user.storage.js";

import { Color } from "@constants/TWPallet.js";

export const useAppStore = create(set => ({
    user: {
        role: "unknown"
    },

    setUser: payload =>
        set(() => {
            saveUserToStorage(payload);

            return { user: payload };
        }),

    setUserRole: role =>
        set(state => ({
            user: { ...state.user, role }
        })),

    updateUser: userData =>
        set(state => ({
            user: { ...state.user, ...userData }
        })),

    hydrateUser: user => set({ user }),

    removeUser: () =>
        set(() => {
            clearUser();
            return {
                user: "unknown"
            };
        })
}));

export const useThemeStore = create(set => ({
    gradientColors: [Color["orange"][100], "#ffffff", Color["orange"][100]],
    secondaryGradientColors: [Color["orange"][200], "#ffffff", Color["orange"][100]]
}));
