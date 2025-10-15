
import { create } from "zustand";

export const useAppStore = create(set => ({
    user: {
        role: "student"
    }, 
    setUser: user => set({ user })
}));
