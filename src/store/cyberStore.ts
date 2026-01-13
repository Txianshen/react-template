import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CyberStoreState {
  userId: string | null;
  sessionId: string | null;
  currentPlan: string | null;
  currentConfig: {
    model_name?: string;
    run_mode?: string;
    max_iters?: number;
  } | null;
  setUserId: (userId: string) => void;
  setSessionId: (sessionId: string | null) => void;
  setCurrentPlan: (plan: string | null) => void;
  setCurrentConfig: (config: CyberStoreState["currentConfig"]) => void;
  clearCyberData: () => void;
}

export const useCyberStore = create(
  immer<CyberStoreState>((set) => ({
    userId: null,
    sessionId: null,
    currentPlan: null,
    currentConfig: null,
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
    setCurrentConfig: (config) =>
      set((state) => {
        state.currentConfig = config;
      }),
    clearCyberData: () =>
      set((state) => {
        state.userId = null;
        state.sessionId = null;
        state.currentPlan = null;
        state.currentConfig = null;
      }),
  }))
);
