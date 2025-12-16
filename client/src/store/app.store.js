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

    globalProgress: 0,

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
        }),

    setGlobalProgress: globalProgress => set({ globalProgress })
}));

export const useMultiSelectionList = create((set, get) => ({
    list: [],

    toggle: id =>
        set(state => {
            const exists = state.list.includes(id);

            return {
                list: exists
                    ? state.list.filter(i => i !== id)
                    : [...state.list, id]
            };
        }),
    
    replace: list => set({ list }),

    isExists: id =>
        get().list.some(
            item => item === id
        ),

    isSelecting: () => get().list?.length > 0,
    
    count: () => get().list?.length,

    clear: () => set({ list: [] })
}));

export const useThemeStore = create(set => ({
    gradientColors: [Color["orange"][100], "#ffffff", Color["orange"][100]],
    secondaryGradientColors: [
        Color["orange"][200],
        "#ffffff",
        Color["orange"][100]
    ]
}));
