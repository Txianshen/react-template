import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { AgentSwitchCard } from "@/components/chat/components/AgentSwitchMessage";
import { Tool } from "@/components/chat/components/Tool";
import { OptionsMessage } from "@/components/chat/components/OptionsMessage";
import { useMemo } from "react";
import { MOCK_MESSAGE_LIST } from "@/lib/constance";
import type { ToolUIPart } from "ai";

// 定义消息类型
export type MessageType = {
  role: "user" | "assistant";
  metadata: {
    title?: string;
    duration?: number;
    status?: string;
  } | null;
  content: string;
  options: { value: string; label: string }[] | null;
};

// 定义 ChatHistory 组件
export default function ChatHistory() {
  // 定义 messageList 变量，用于渲染对话列表
  const messageList = useMemo(() => MOCK_MESSAGE_LIST, []);

  return (
    <Conversation className="h-full">
      <ConversationContent className="gap-4">
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
                <Tool
                  title={message.metadata.title}
                  content={message.content}
                  status="done"
                  duration={message.metadata.duration}
                />
              </div>
            );
          }

          // 选择项消息
          if (message.options && message.options.length > 0) {
            // 确定状态值，如果消息中有状态则使用，否则默认为 "approval-requested"
            const status: ToolUIPart["state"] =
              (message.metadata?.status as ToolUIPart["state"]) ||
              "approval-requested";

            return (
              <div key={index} className="w-full max-w-[80%]">
                <OptionsMessage
                  content={message.content}
                  options={message.options}
                  status={status}
                  onOptionSelect={(value) => {
                    // 在实际应用中，这里应该调用相应的处理函数
                    console.log(`User selected: ${value}`);
                  }}
                />
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
