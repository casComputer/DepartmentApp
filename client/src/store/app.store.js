import { create } from "zustand";

import { setUser as saveUserToStorage } from "@storage/user.storage.js";

export const useAppStore = create(set => ({
    user: {
        role: 'unknown'
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
        set(() => ({
            user: "unknown"
        }))
}));
