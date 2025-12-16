// 定义单条消息的数据结构
// export type MessageData = {
//   role: "user" | "assistant";
//   content: string;
//   metadata: {
//     title?: string;
//     duration?: number;
//     status?: string;
//   } | null;
//   options: { value: string; label: string }[] | null;
// };

export interface MessageData {
  id: string;
  name: string;
  role: string;
  type?: string; // 添加 type 字段
  content: any;
  metadata: any;
  timestamp: string;
}
// 定义消息对象结构
export type MessageItem = {
  id: string;
  role?: "user" | "assistant";
  type?: "user_message" | "agent_message" | "agent_message_done";
  parentId: string | null;
  childrenIds: string[];
  data: MessageData[];
  done?: boolean;
};

// 定义历史记录结构
export type History = {
  currentId: string | null;
  messages: Record<string, MessageItem>;
};
