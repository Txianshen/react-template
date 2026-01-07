import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import type { StableResponse } from "@/types/chat";
export function applyTextSSE(event: any, state: StreamingStoreState) {
  const { responses, cursor } = state;

  /** ---------- response ---------- */
  if (event.object === "response") {
    if (event.status === "created") {
      responses.push({
        id: event.id,
        role: "assistant",
        status: "created",
        content: [],
      });
      cursor.responseId = event.id;
      cursor.messageId = undefined;
    }

    // response in_progress 增加会话加载loading效果
    if (event.status === "in_progress" && cursor.responseId) {
      const r = responses.find((r) => r.id === cursor.responseId);
      if (r) {
        r.status = "in_progress";
        r.isLoading = true;
      }
    }

    if (event.status === "completed" && cursor.responseId) {
      const r = responses.find((r) => r.id === cursor.responseId);
      if (r) {
        r.status = "completed";
        r.isLoading = false;
      }
    }
    return;
  }

  const response = responses.find((r) => r.id === cursor.responseId);
  if (!response) return;

  /** ---------- message ---------- */
  if (event.object === "message" && event.role === "assistant") {
    // 一旦有message消息 需要将isLoading状态重置为false
    const r = responses.find((r) => r.id === cursor.responseId);
    if (r && r.isLoading) {
      r.isLoading = false;
    }

    if (event.status === "in_progress" && event.id) {
      response.content.push({
        id: event.id,
        object: "message",
        type: event.type,
        role: "assistant",
        status: "created",
        content: [],
      });
      cursor.messageId = event.id;
    }

    if (event.status === "completed") {
      const msg = response.content.find((m) => m.id === event.id);
      if (msg) msg.status = "completed";
    }
    return;
  }

  // plugin_call_output
  if (
    event.object === "message" &&
    event.type === "plugin_call_output" &&
    event.role === "tool"
  ) {
    response.content.push({
      id: event.id,
      object: "message",
      type: event.type,
      role: event.role,
      status: event.status,
      content: event.content,
    });
    cursor.messageId = event.id;
    return;
  }

  /** ---------- content (text) ---------- */
  if (event.object === "content" && event.type === "text") {
    const msg = response.content.find((m) => m.id === event.msg_id);
    if (!msg) return;

    const index = event.index ?? 0;

    let content = msg.content?.find((c) => c.index === index);
    if (!content) {
      content = {
        object: "content",
        type: "text",
        index,
        status: "in_progress",
        text: "",
      };
      msg.content.push(content);
    }

    if (event.delta === true) {
      content.text += event.text ?? "";
    }

    if (event.status === "completed") {
      content.status = "completed";
      if (event.delta === false && event.text) {
        content.text = event.text;
      }
    }
  }

  /** ---------- content (工具调用) ---------- */
  if (event.object === "content" && event.type === "data") {
    const msg = response.content.find((m) => m.id === event.msg_id);
    if (!msg) return;
    const index = event.index ?? 0;
    let content = msg.content?.find((c) => c.index === index);
    if (!content) {
      content = {
        object: "content",
        type: "data",
        index,
        status: "in_progress",
        data: event.data,
      };
      msg.content.push(content);
    }
    if (event.status === "completed") {
      content.status = "completed";
      if (event.delta === false && event.data) {
        content.data = event.data;
      }
    }
  }
  /** ---------- content (工具调用输出) ---------- */
}

export interface StreamingStoreState {
  responses: StableResponse[];

  // 当前流式游标（不是 UI 数据）
  cursor: {
    responseId?: string;
    messageId?: string;
  };

  // SSE 入口
  applySSEEvent: (event: any) => void;

  //applyUserMessage
  applyUserMessage: (text: string, sessionId: string) => void;

  // setResponses
  setResponses: (responses: StableResponse[], sessionId?: string) => void;

  // reset / clear
  reset: () => void;
}

function transformBackendMessagesToUIMessages(
  backendMessages: any[],
  options: any
) {
  const {
    sessionId,
    isLoading = false,
    responseIdGenerator = () => `response-${Date.now()}`,
  } = options;

  const uiMessages = [];

  for (const msg of backendMessages) {
    const role = msg.role === "user" ? "user" : "assistant";
    const lastUIMessage = uiMessages[uiMessages.length - 1] as StableResponse;

    // 如果没有上一个，或者 role 变了 → 新建 UIMessage
    if (!lastUIMessage || lastUIMessage.role !== role) {
      uiMessages.push({
        id: responseIdGenerator(role),
        role,
        status: msg.status || "completed",
        isLoading,
        session_id: sessionId,

        // 👇 注意：这里是数组
        content: [
          {
            ...msg,
            text: msg.content?.find((c: any) => c.type === "text")?.text || "",
          },
        ],
      });
    } else {
      // role 相同 → 追加到当前 UIMessage
      lastUIMessage.content.push({
        ...msg,
        text: msg.content?.find((c: any) => c.type === "text")?.text || "",
      });
    }
  }

  return uiMessages;
}

export const useStreamingStore = create(
  immer<StreamingStoreState>((set) => ({
    responses: [] as StableResponse[],
    cursor: {},

    applySSEEvent: (event) => {
      set((state) => {
        applyTextSSE(event, state); // ✅ 现在可以返回 void
      });
    },
    applyUserMessage: (text: string, sessionId: string) => {
      set((state) => {
        state.responses.push({
          id: uuidv4(), // uuid
          role: "user",
          type: "message",
          content: [
            {
              type: "text",
              text: text,
              status: "created",
            } as any,
          ],
          session_id: sessionId,
        });
      });
    },
    setResponses: (responses, sessionId) => {
      set((state) => {
        state.responses = transformBackendMessagesToUIMessages(responses, {
          sessionId,
          isLoading: false,
        });
      });
    },

    reset: () => {
      set((state) => {
        state.responses = [];
        state.cursor = {};
      });
    },
  }))
);
