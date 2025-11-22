import { create } from "zustand";

type User = {
    role: "student" | "teacher" | "parent" | "admin" | "unknown";
    userId?: string;
    fullname?: string;
    course?: string;
    year_of_study?: string;
};

type AppState = {
    user: User;
    setUserRole: (role: User["role"]) => void;
    updateUser: (userData: Partial<User>) => void;
    removeUser: () => void;
};

const initialUser: User = {
    role: "unknown"
};

export const useAppStore = create<AppState>(set => ({
    user: initialUser,

    setUserRole: role =>
        set(state => ({
            user: { ...state.user, role }
        })),

    updateUser: userData =>
        set(state => ({
            user: { ...state.user, ...userData }
        })),

    removeUser: () =>
        set(() => ({
            user: initialUser
        }))
}));
