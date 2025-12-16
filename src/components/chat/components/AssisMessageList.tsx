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
  const renderContentItem = (
    contentItem: any,
    contentIndex: number,
    parentId: string,
    messageType: string // 添加消息类型参数
  ) => {
    // 工具调用卡片 - 根据message.type判断是输入还是输出
    if (contentItem.type === "data" && contentItem.data?.name) {
      try {
        let content = contentItem.data;
        // 如果是plugin_call_output类型，尝试解析output字段
        if (messageType === "plugin_call_output" && contentItem.data.output) {
          try {
            content = JSON.parse(contentItem.data.output);
          } catch {
            // 解析失败则使用原始数据
            content = contentItem.data.output;
          }
        }
        // 如果是plugin_call类型，尝试解析arguments字段
        else if (messageType === "plugin_call" && contentItem.data.arguments) {
          try {
            content = JSON.parse(contentItem.data.arguments);
          } catch {
            // 解析失败则使用原始数据
            content = contentItem.data.arguments;
          }
        }

        return (
          <Tool
            title={`${contentItem.data.name}`}
            key={`${parentId}-${index}-${contentIndex}`}
            content={
              Array.isArray(content)
                ? content
                    .map((o: any) => o.text || JSON.stringify(o, null, 2))
                    .join("\n")
                : typeof content === "string"
                  ? content
                  : JSON.stringify(content, null, 2)
            }
            className="my-2"
          />
        );
      } catch {
        return (
          <Tool
            title={`${contentItem.data.name}`}
            key={`${parentId}-${index}-${contentIndex}`}
            content={JSON.stringify(contentItem.data, null, 2)}
            className="my-2"
          />
        );
      }
    }

    // 文本内容
    if (contentItem.type === "text") {
      return (
        <MessageResponse key={`${parentId}-${index}-${contentIndex}`}>
          {contentItem.text}
        </MessageResponse>
      );
    }

    // 其他类型内容默认处理
    return (
      <MessageResponse key={`${parentId}-${index}-${contentIndex}`}>
        {typeof contentItem === "string"
          ? contentItem
          : JSON.stringify(contentItem, null, 2)}
      </MessageResponse>
    );
  };

  return (
    <Message key={`${messageId}-${index}`} from="assistant" className="">
      {/* !bg-cyan-500/10 !border-cyan-400/40  */}
      <MessageContent className="message-content text-2xl !bg-cyan-700/10 !border-cyan-400/40 text-white">
        {messages.map((message) => {
          // 检查 message.content 是否为数组
          if (Array.isArray(message.content)) {
            // 根据消息类型渲染不同内容
            if (message.type === "message") {
              // 普通消息类型，渲染文本内容
              return message.content.map((contentItem, contentIndex) =>
                renderContentItem(
                  contentItem,
                  contentIndex,
                  message.id,
                  message.type || ""
                )
              );
            } else if (message.type === "plugin_call") {
              // plugin_call 类型，渲染工具调用卡片
              return message.content.map((contentItem, contentIndex) =>
                renderContentItem(
                  contentItem,
                  contentIndex,
                  message.id,
                  message.type || ""
                )
              );
            } else if (message.type === "plugin_call_output") {
              // plugin_call_output 类型，渲染工具结果卡片
              return message.content.map((contentItem, contentIndex) =>
                renderContentItem(
                  contentItem,
                  contentIndex,
                  message.id,
                  message.type || ""
                )
              );
            } else {
              // 其他类型，按默认方式处理
              return message.content.map((contentItem, contentIndex) =>
                renderContentItem(
                  contentItem,
                  contentIndex,
                  message.id,
                  message.type || ""
                )
              );
            }
          }
          // 如果不是数组，返回空
          return null;
        })}
      </MessageContent>
    </Message>
  );
}
