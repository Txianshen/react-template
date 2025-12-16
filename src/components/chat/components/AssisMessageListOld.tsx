// import { AgentSwitchCard } from "./AgentSwitchMessage";
import { Tool } from "./Tool";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
// import { ActionsMessage as AssisActions } from "./AssisActions";
// import type { Message as MessageType } from "@/lib/mockMessage";
import type { MessageData } from "@/types/chat";

export interface AssisMessageProps {
  messages: MessageData[];
  index: number;
  messageId: string;
}

export function AssisMessageList({
  messages,
  index,
  messageId,
}: AssisMessageProps) {
  // 渲染内容项的函数
  const renderContentItem = (contentItem: any, contentIndex: number) => {
    // 工具调用卡片
    if (contentItem.type === "tool_use") {
      return (
        <Tool
          title={`调用 ${contentItem.name}`}
          key={`${messageId}-${index}-${contentIndex}`}
          content={JSON.stringify(contentItem.input, null, 2)}
          className="my-2 "
        />
      );
    }

    // 工具结果卡片
    if (contentItem.type === "tool_result") {
      return (
        <Tool
          title={`工具 ${contentItem.name} 执行结果`}
          key={`${messageId}-${index}-${contentIndex}`}
          content={
            Array.isArray(contentItem.output)
              ? contentItem.output
                  .map((o: any) => o.text || JSON.stringify(o))
                  .join("\n")
              : JSON.stringify(contentItem.output, null, 2)
          }
          className="my-2"
        />
      );
    }

    // 文本内容
    if (contentItem.type === "text") {
      return (
        <MessageResponse key={`${messageId}-${index}-${contentIndex}`}>
          {contentItem.text}
        </MessageResponse>
      );
    }

    // 其他类型内容默认处理
    return (
      <MessageResponse key={`${messageId}-${index}-${contentIndex}`}>
        {typeof contentItem === "string"
          ? contentItem
          : JSON.stringify(contentItem)}
      </MessageResponse>
    );
  };

  return (
    <Message key={`${messageId}-${index}`} from="assistant" className="">
      {/* !bg-cyan-500/10 !border-cyan-400/40  */}
      <MessageContent className="message-content text-2xl !bg-cyan-700/10 !border-cyan-400/40  text-white">
        {messages.map((message) => {
          // 检查 message.content 是否为数组
          if (Array.isArray(message.content)) {
            // 如果是数组，遍历数组中的每个元素并渲染
            return message.content.map((contentItem, contentIndex) =>
              renderContentItem(contentItem, contentIndex)
            );
          }
          // 如果不是数组，返回空
          return null;
        })}
      </MessageContent>
    </Message>
  );
}
