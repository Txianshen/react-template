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

  // 只获取最后一条符合条件的消息
  const lastMessage = [...messages].reverse().find((message) => {
    return (
      message.type === "agent_message" &&
      typeof message.data?.content === "string" &&
      message.data?.content &&
      !message.data?.metadata
    );
  });

  return (
    <Conversation className="h-full ">
      <ConversationContent className="gap-4">
        {lastMessage && (
          <Message
            key={`${lastMessage.data?.id}-${messages.length - 1}`}
            from="assistant"
            className=""
          >
            <MessageContent className=" message-content text-white text-2xl">
              <MessageResponse
                key={`${lastMessage.data?.id}-${messages.length - 1}`}
              >
                {lastMessage.data?.content as string}
              </MessageResponse>
            </MessageContent>
          </Message>
        )}
        <ConversationScrollButton />
      </ConversationContent>
    </Conversation>
  );
}
