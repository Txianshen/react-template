// import { AgentSwitchCard } from "./AgentSwitchMessage";
import { Tool } from "./Tool";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
// import { ActionsMessage as AssisActions } from "./AssisActions";
import type { Message as MessageType } from "@/lib/mockMessage";

// 定义工具内容项的类型
interface ToolContentItem {
  type: string;
  name?: string;
  input?: any;
  output?: any;
  text?: string;
}

export interface AssisMessageProps {
  message: MessageType;
  index: number;
  messageId: string;
}

export function AssisMessage({ message, index, messageId }: AssisMessageProps) {
  // 检查是否为工具调用消息 (根据新的数据结构)
  if (Array.isArray(message.data?.content)) {
    return (
      <Message key={`${messageId}-${index}`} from="assistant" className="">
        <MessageContent>
          {message.data.content.map(
            (contentItem: ToolContentItem, contentIndex) => {
              // 工具调用卡片
              if (contentItem.type === "tool_use") {
                return (
                  <Tool
                    title={`调用 ${contentItem.name}`}
                    key={`${messageId}-${index}-${contentIndex}`}
                    content={JSON.stringify(contentItem.input, null, 2)}
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
                  />
                );
              }

              // 文本内容
              if (contentItem.type === "text") {
                return (
                  <MessageResponse
                    key={`${messageId}-${index}-${contentIndex}`}
                  >
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
            }
          )}
        </MessageContent>
      </Message>
    );
  }
  // 普通消息
  return (
    <></>
    // <Message key={`${messageId}-${index}`} from="assistant" className="">
    //   <MessageContent className="text-white">
    //     <MessageResponse key={`${messageId}-${index}`}>
    //       {message.data?.content as string}
    //     </MessageResponse>
    //   </MessageContent>
    // </Message>
  );
}
