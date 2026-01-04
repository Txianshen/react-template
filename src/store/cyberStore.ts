import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CyberStoreState {
  userId: string | null;
  sessionId: string | null;
  currentPlan: string | null;
  setUserId: (userId: string) => void;
  setSessionId: (sessionId: string | null) => void;
  setCurrentPlan: (plan: string | null) => void;
  clearCyberData: () => void;
}

export const useCyberStore = create(
  immer<CyberStoreState>((set) => ({
    userId: null,
    sessionId: null,
    currentPlan: null,
    setUserId: (userId) =>
      set((state) => {
        state.userId = userId;
      }),
    setSessionId: (sessionId) =>
      set((state) => {
        state.sessionId = sessionId;
      }),
    setCurrentPlan: (plan) =>
      set((state) => {
        state.currentPlan = plan;
      }),
    clearCyberData: () =>
      set((state) => {
        state.userId = null;
        state.sessionId = null;
        state.currentPlan = null;
      }),
  }))
);
