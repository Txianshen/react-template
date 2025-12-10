import { create } from "zustand";
import type { Message } from "../lib/mockMessage";

interface HistoryState {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => {
      // 如果消息有id，则检查是否已存在相同id的消息
      if (message.data && message.data.id) {
        const existingIndex = state.messages.findIndex(
          (msg) => msg.data && msg.data.id === message.data.id
        );

        if (existingIndex !== -1) {
          // 如果找到相同id的消息，则更新它
          const updatedMessages = [...state.messages];
          updatedMessages[existingIndex] = message;
          console.log("更新消息:", message);
          console.log("当前messages数组:", updatedMessages);
          return { messages: updatedMessages };
        }
      }

      // 如果没有相同id的消息，则添加新消息
      console.log("添加新消息:", message);
      const newMessages = [...state.messages, message];
      console.log("当前messages数组:", newMessages);
      return { messages: newMessages };
    }),
  clearMessages: () => set({ messages: [] }),
}));
