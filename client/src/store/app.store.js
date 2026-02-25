import { create } from "zustand";
import { router } from "expo-router";

import {
    setUser as saveUserToStorage,
    clearUser
} from "@storage/user.storage.js";

export const useAppStore = create(set => ({
    user: {
        role: "unknown", 
        fullname: "",
        userId: "",
        dp: "",
        email: "",
        
        courses: [],
        students: [],
    },

    globalProgress: 0,
    globalProgressText: "",

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
        set(state => {
            const user = { ...state.user, ...userData };
            
            saveUserToStorage(user);
            return {
                user: user
            };
        }),

    hydrateUser: user => set({ user }),

    removeUser: () =>
        set(() => {
            clearUser();
            router.replace("auth/Signin");
            return {
                user: "unknown"
            };
        }),

    setGlobalProgress: globalProgress => set({ globalProgress }),
    setGlobalProgressText: globalProgressText => set({ globalProgressText })
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

    isExists: id => get().list.some(item => item === id),

    isSelecting: () => get().list?.length > 0,

    count: () => get().list?.length,

    clear: () => set({ list: [] })
}));

export const usePromptStore = create((set) => ({
    visible: false,
    title: "",
    message: "",
    requireText: "",
    onConfirm: null,

    open: ({ title, message, requireText, onConfirm }) =>
        set({
            visible: true,
            title,
            message,
            requireText,
            onConfirm
        }),

    close: () =>
        set({ visible: false })
}));