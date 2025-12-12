import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { UserMessage } from "@/components/chat/components/UserMessage";
import { AssisMessage } from "@/components/chat/components/AssisMessage";
import { useHistoryStore } from "@/store/history";
// import { nanoid } from "nanoid";
// import { mockMessages } from "@/lib/mockMessage";
// 定义 ChatHistory 组件
export default function ChatHistory() {
  // 获取当前对话的消息列表
  const messages = useHistoryStore((state) => state.messages);
  // const messages = mockMessages;

  return (
    <Conversation className="h-full ">
      <ConversationContent className="gap-4">
        {messages.map((message, index) => {
          // 用户消息 - 使用type字段判断
          if (message.type === "user_message") {
            return (
              <UserMessage
                key={index}
                message={message}
                index={index}
                messageId={message.data?.id}
              />
            );
          }

          // 系统消息/助手消息 - 使用type字段判断
          if (message.type === "agent_message") {
            return (
              <AssisMessage
                key={index}
                message={message}
                index={index}
                messageId={message.data?.id}
              />
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
