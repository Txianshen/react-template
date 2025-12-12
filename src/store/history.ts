import { create } from "zustand";
import type { Message } from "../lib/mockMessage";
// import type { Message as MessageType } from "@/lib/mockMessage";
import type { MessageData } from "../types/chat";

// 定义消息对象结构
interface MessageItem {
  id: string;
  role?: "user" | "assistant";
  parentId: string | null;
  childrenIds: string[];
  data: MessageData[];
  done?: boolean;
}

// 定义 Map 结构类型，用于存储按不同类型组织的消息
interface MessageMap {
  [key: string]: MessageItem;
}

// 定义历史记录结构
interface History {
  currentId: string | null;
  messages: MessageMap;
}

interface HistoryState {
  messages: Message[];
  history: History; // 修改为 History 对象
  addMessage: (message: Message) => void;
  addMessageToMap: (message: Message) => void; // 修改此方法以符合新结构
  setCurrentId: (id: string | null) => void; // 添加设置 currentId 的方法
  clearMessages: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  messages: [],
  history: {
    currentId: null,
    messages: {},
  },
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
  addMessageToMap: (message) =>
    set((state) => {
      // 创建新的 messages
      const newMessageMap = { ...state.history.messages };

      // 确定消息的 key：user 类型消息使用 data.id，agent 类型消息使用 run_id
      const key =
        message.type === "user_message" ? message.data.id : message.run_id;

      // 获取当前时间戳
      const timestamp = new Date().toISOString();

      // 如果 key 已存在，更新现有条目
      if (newMessageMap[key]) {
        // 查找是否已存在相同 id 的消息
        const existingIndex = newMessageMap[key].data.findIndex(
          (item) => item.id === message.data.id
        );

        let newData;
        if (existingIndex !== -1) {
          // 如果已存在相同 id 的消息，更新它
          newData = [...newMessageMap[key].data];
          newData[existingIndex] = {
            ...message.data,
            timestamp: message.data.timestamp || timestamp,
          };
        } else {
          // 如果不存在相同 id 的消息，添加新消息
          newData = [
            ...newMessageMap[key].data,
            {
              ...message.data,
              timestamp: message.data.timestamp || timestamp,
            },
          ];
        }

        // 创建更新后的 MessageItem
        const updatedMessageItem = {
          ...newMessageMap[key],
          data: newData,
        };

        // 如果是 agent_message_done 类型，标记为完成
        if (message.type === "agent_message_done") {
          updatedMessageItem.done = true;
        }

        // 更新 messages
        newMessageMap[key] = updatedMessageItem;
      } else {
        // 如果 key 不存在，创建新条目
        const newMessageItem: MessageItem = {
          id: key,
          role: message.data.role as "user" | "assistant" | undefined,
          parentId: state.history.currentId,
          childrenIds: [],
          data: [
            {
              ...message.data,
              timestamp: message.data.timestamp || timestamp,
            },
          ],
          done: message.type === "agent_message_done",
        };

        // 更新 messages
        newMessageMap[key] = newMessageItem;
      }

      // 返回更新后的状态
      console.log("更新后的 messages:", {
        ...state.history,
        currentId: key, // 设置当前ID为最新消息的ID
        messages: newMessageMap,
      });
      return {
        history: {
          ...state.history,
          currentId: key, // 设置当前ID为最新消息的ID
          messages: newMessageMap,
        },
      };
    }),
  setCurrentId: (id) =>
    set((state) => ({
      history: {
        ...state.history,
        currentId: id,
      },
    })),
  clearMessages: () =>
    set({ messages: [], history: { currentId: null, messages: {} } }),
}));
