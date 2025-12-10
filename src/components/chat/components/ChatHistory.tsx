import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { UserMessage } from "@/components/chat/components/UserMessage";
import { AssisMessage } from "@/components/chat/components/AssisMessage";
import { useMemo } from "react";
import { MOCK_MESSAGE_LIST } from "@/lib/constance";
import { createMessagesList } from "@/lib/utils";
// import { nanoid } from "nanoid";

// 定义 ChatHistory 组件
export default function ChatHistory() {
  // 获取当前对话的消息列表
  const messageList = useMemo(() => {
    // 使用 createMessagesList 方法从 history 结构中提取消息列表
    const messages = createMessagesList(
      MOCK_MESSAGE_LIST,
      MOCK_MESSAGE_LIST.currentId
    );
    console.log(messages);
    return messages;
  }, []);

  return (
    <Conversation className="h-full ">
      <ConversationContent className="gap-4">
        {/* 添加 Reasoning 组件demo示例
        <Reasoning
          isStreaming={false}
          content="This is a sample reasoning content to demonstrate the component. Let me think through this step by step..."
        /> */}
        {messageList.map((message, index) => {
          // 用户消息
          if (message.role === "user") {
            return (
              <UserMessage
                key={index}
                message={message}
                index={index}
                messageId="msg-history"
              />
            );
          }

          // 系统消息，使用 AssisMessage 组件处理
          return (
            <AssisMessage
              key={index}
              message={message}
              index={index}
              messageId="msg-history"
            />
          );
        })}
        <ConversationScrollButton />
      </ConversationContent>
    </Conversation>
  );
}
