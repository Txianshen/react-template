import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/chat";
import { AgentSwitchCard } from "@/components/chat/components/AgentSwitchCard";
import { useMemo } from "react";
import { MOCK_MESSAGE_LIST } from "@/lib/constance";

// 定义消息类型
export type MessageType = {
  role: "user" | "assistant";
  metadata: {
    title?: string;
    duration?: number;
    status?: string;
  } | null;
  content: string;
  options: unknown[] | null;
};

// 定义 ChatHistory 组件
export default function ChatHistory() {
  // 定义 messageList 变量，用于渲染对话列表
  const messageList = useMemo(() => MOCK_MESSAGE_LIST, []);

  return (
    <Conversation className="h-full">
      <ConversationContent>
        {/* 添加 Reasoning 组件demo示例
        <Reasoning
          isStreaming={false}
          content="This is a sample reasoning content to demonstrate the component. Let me think through this step by step..."
        /> */}
        {messageList.map((message, index) => {
          // 智能体切换提示卡片
          if (message.metadata?.title?.includes("智能体发生切换")) {
            return (
              <div key={index} className="w-full max-w-[80%]">
                <AgentSwitchCard
                  title={message.metadata.title}
                  content={message.content}
                />
              </div>
            );
          }

          // 工具调用卡片
          if (message.metadata?.title?.includes("调用")) {
            return (
              <div key={index} className="w-full max-w-[80%]">
                <div className="bg-gray-100 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between p-3 border-b border-gray-300">
                    <div className="font-medium text-sm">
                      {message.metadata.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {message.metadata.duration?.toFixed(2)}s
                    </div>
                  </div>
                  <div className="p-3">
                    <MessageResponse>{message.content}</MessageResponse>
                  </div>
                </div>
              </div>
            );
          }

          // 普通消息
          return (
            <Message
              key={index}
              from={message.role as "user" | "assistant"}
              className={message.role === "user" ? "ml-auto" : ""}
            >
              <MessageContent>
                <MessageResponse>{message.content}</MessageResponse>
              </MessageContent>
            </Message>
          );
        })}
      </ConversationContent>
    </Conversation>
  );
}
