import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 窗口状态类型
interface WindowState {
  id: string;
  title: string;
  minimized: boolean;
}

// 窗口状态管理 Store 类型
interface WindowStore {
  // 窗口状态映射
  windows: Record<string, WindowState>;
  // 当前激活的窗口 ID
  activeId: string | null;
  // 注册窗口
  registerWindow: (id: string, title: string) => void;
  // 注销窗口
  unregisterWindow: (id: string) => void;
  // 最小化窗口
  minimizeWindow: (id: string) => void;
  // 恢复窗口
  restoreWindow: (id: string) => void;
  // 设置激活窗口
  setActiveId: (id: string | null) => void;
  // 获取最小化的窗口列表
  getMinimizedWindows: () => WindowState[];
}

// 创建 Zustand Store
export const useWindowStore = create<WindowStore>()(
  devtools(
    (set, get) => ({
      windows: {},
      activeId: null,
      registerWindow: (id, title) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { id, title, minimized: false },
          },
        })),
      unregisterWindow: (id) =>
        set((state) => {
          const newWindows = { ...state.windows };
          delete newWindows[id];
          return { windows: newWindows };
        }),
      minimizeWindow: (id) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], minimized: true },
          },
        })),
      restoreWindow: (id) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], minimized: false },
          },
        })),
      setActiveId: (id) => set({ activeId: id }),
      getMinimizedWindows: () => {
        const { windows } = get();
        return Object.values(windows).filter((window) => window.minimized);
      },
    }),
    {
      name: "WindowStore",
    }
  )
);
