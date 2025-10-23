import { create } from "zustand";

import { getUser } from "../utils/storage";

type User = {
  role: "student" | "teacher" | "parent" | "admin" | "";
  userId?: string;
  fullname?: string;
  course?: string;
  year_of_study?: string;
};

type AppState = {
  user: User;
  setUserRole: (role: User["role"]) => void;
  updateUser: (userData: Partial<User>) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: {
    role: ""
  },
  setUserRole: (role: User["role"]) =>
    set((state) => ({
      user: { ...state.user, role },
    })),

  updateUser: (userData: Partial<User>) =>
    set((state) => ({
      user: { ...state.user, ...userData },
    })),
}));
