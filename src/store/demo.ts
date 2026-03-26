/**
 * 示例 Store - 仅供学习参考
 *
 * 使用方法：
 * 1. 从这里导入 store
 * 2. 在组件中直接使用 store 的状态和方法
 *
 * 示例：
 * import { useDemoStore } from "@/store/demo"
 *
 * function Component() {
 *   const count = useDemoStore((state) => state.count)
 *   const increment = useDemoStore((state) => state.increment)
 *   return <button onClick={increment}>+1</button>
 * }
 */
import { create } from "zustand";

interface DemoState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
