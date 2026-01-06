import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
  name: string;
  avatar?: string;
}

interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
  updateProfile: (userInfo: Partial<UserInfo>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      login: (token, userInfo) => {
        localStorage.setItem("token", token);
        set({ token, userInfo });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, userInfo: null });
      },
      updateProfile: (info) =>
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...info } : null,
        })),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ token: state.token, userInfo: state.userInfo }),
    }
  )
);
