import type { ToolUIPart } from "ai";
import { AgentSwitchCard } from "./AgentSwitchMessage";
import { Tool } from "./Tool";
import { OptionsMessage } from "./OptionsMessage";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { ActionsMessage as AssisActions } from "./AssisActions";
import type { MessageData } from "@/types/chat";

export interface AssisMessageProps {
  messages: MessageData[];
  index: number;
  messageId: string;
}

export function AssisMessage({
  messages,
  index,
  messageId,
}: AssisMessageProps) {
  return (
    <Message key={`${messageId}-${index}`} from="assistant" className="">
      <MessageContent className="text-white">
        {messages &&
          messages.map((message, messageIndex) => {
            // 智能体切换提示卡片
            if (message.metadata?.title?.includes("智能体发生切换")) {
              return (
                <div key={`${messageId}-${index}-${messageIndex}`}>
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
                <div key={`${messageId}-${index}-${messageIndex}`}>
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
            // if (message.options && message.options.length > 0) {
            //   // 确定状态值，如果消息中有状态则使用，否则默认为 "approval-requested"
            //   const status: ToolUIPart["state"] =
            //     (message.metadata?.status as ToolUIPart["state"]) ||
            //     "approval-requested";

            //   return (
            //     <div key={`${messageId}-${index}-${messageIndex}`}>
            //       <OptionsMessage
            //         content={message.content}
            //         options={message.options}
            //         status={status}
            //         onOptionSelect={(value) => {
            //           // 在实际应用中，这里应该调用相应的处理函数
            //           console.log(`User selected: ${value}`);
            //         }}
            //       />
            //     </div>
            //   );
            // }

            // 普通消息
            return (
              <MessageResponse key={`${messageId}-${index}-${messageIndex}`}>
                {message.content}
              </MessageResponse>
            );
          })}
      </MessageContent>
      <AssisActions />
    </Message>
  );
}
