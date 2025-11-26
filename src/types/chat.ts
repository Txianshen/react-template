// 定义单条消息的数据结构
export type MessageData = {
  role: "user" | "assistant";
  content: string;
  metadata: {
    title?: string;
    duration?: number;
    status?: string;
  } | null;
  options: { value: string; label: string }[] | null;
};

// 定义消息对象结构
export type MessageItem = {
  id: string;
  role?: "user" | "assistant";
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
