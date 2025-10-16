
import { create } from "zustand";

type User = {
    role: "student" | "teacher" | "parent" | null;
};

type AppState = {
  user: User;
  setUserRole: (role: User['role']) => void;
};

export const useAppStore = create<AppState>(set => ({
    user: {
        role: "student"
    },
    setUserRole: (role: User['role']) => set(state => ({
        user: { ...state.user, role }
    }))
}));
