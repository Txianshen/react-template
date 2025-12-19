export interface ContentItem {
  object: "content";
  type: "text" | "data";
  index: number;
  status: "in_progress" | "completed";
  data?: any;
  text?: string;
}

export interface Message {
  id: string;
  object: "message";
  type: "message" | "plugin_call" | "plugin_call_output" | "text";
  role: "assistant" | "user" | "tool";
  status: "created" | "completed" | "in_progress";
  content: ContentItem[];
  text?: string;
}

export interface StableResponse {
  id: string;
  role: "assistant" | "user";
  status: "created" | "in_progress" | "completed";
  isLoading?: boolean;
  session_id?: string;
  content: Message[];
}
