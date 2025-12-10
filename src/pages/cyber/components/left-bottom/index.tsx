import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useHistoryStore } from "@/store/history";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
// import { nanoid } from "nanoid";

// 定义 LeftBottom 组件
export default function LeftBottom() {
  // 获取当前对话的消息列表
  const messages = useHistoryStore((state) => state.messages);

  return (
    <Conversation className="h-full ">
      <ConversationContent className="gap-4">
        {messages.map((message, index) => {
          // 系统消息/助手消息 - 使用type字段判断
          if (
            message.type === "agent_message" &&
            typeof message.data?.content === "string" &&
            message.data?.content &&
            !message.data?.metadata
          ) {
            return (
              <Message
                key={`${message.data?.id}-${index}`}
                from="assistant"
                className=""
              >
                <MessageContent className="text-white">
                  <MessageResponse key={`${message.data?.id}-${index}`}>
                    {message.data?.content as string}
                  </MessageResponse>
                </MessageContent>
              </Message>
            );
          }
          // 其他类型的消息默认使用AssisMessage处理
          return <></>;
        })}
        <ConversationScrollButton />
      </ConversationContent>
    </Conversation>
  );
}
