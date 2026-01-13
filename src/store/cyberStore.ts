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
  sessionConfigs: {
    [sessionId: string]: {
      model_name?: string;
      run_mode?: string;
      max_iters?: number;
    };
  };
  setUserId: (userId: string) => void;
  setSessionId: (sessionId: string | null) => void;
  setCurrentPlan: (plan: string | null) => void;
  setCurrentConfig: (config: CyberStoreState["currentConfig"]) => void;
  setSessionConfig: (
    sessionId: string,
    config: CyberStoreState["currentConfig"]
  ) => void;
  updateSessionConfigs: (configs: CyberStoreState["sessionConfigs"]) => void;
  clearCyberData: () => void;
}

export const useCyberStore = create(
  immer<CyberStoreState>((set) => ({
    userId: null,
    sessionId: null,
    currentPlan: null,
    currentConfig: null,
    sessionConfigs: {},
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
    setSessionConfig: (sessionId, config) =>
      set((state) => {
        if (config) {
          state.sessionConfigs[sessionId] = config;
        } else {
          delete state.sessionConfigs[sessionId];
        }
      }),
    updateSessionConfigs: (configs) =>
      set((state) => {
        state.sessionConfigs = configs;
      }),
    clearCyberData: () =>
      set((state) => {
        state.userId = null;
        state.sessionId = null;
        state.currentPlan = null;
        state.currentConfig = null;
        state.sessionConfigs = {};
      }),
  }))
);

// 自定义 hook，用于获取当前会话的配置
export const useCurrentSessionConfig = () => {
  const sessionId = useCyberStore((state) => state.sessionId);
  const sessionConfigs = useCyberStore((state) => state.sessionConfigs);
  const currentConfig = useCyberStore((state) => state.currentConfig);
  console.log(
    "useCurrentSessionConfig",
    sessionId,
    sessionConfigs,
    currentConfig
  );
  return sessionId ? sessionConfigs[sessionId] : currentConfig;
};
