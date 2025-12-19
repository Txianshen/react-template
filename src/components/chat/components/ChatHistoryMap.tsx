import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { UserMessageList } from "@/components/chat/components/UserMessageList";

import { AssisMessageList } from "@/components/chat/components/AssisMessageList";
import { useStreamingStore } from "@/store/streamingStoreState";

// 定义 ChatHistory 组件
export default function ChatHistoryMap() {
  const responses = useStreamingStore((s) => s.responses);
  return (
    <Conversation className="h-full ">
      <ConversationContent className="gap-4">
        {responses.map((message, index) => {
          // 用户消息 - 使用type字段判断
          if (message.role === "user") {
            return (
              <UserMessageList
                key={index}
                messages={message.content || []}
                index={index}
                messageId={message.id}
              />
            );
          }

          // 系统消息/助手消息 - 使用type字段判断
          if (message.role === "assistant") {
            if (message.isLoading) {
              return (
                <div className="flex items-center py-4">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              );
            } else {
              return (
                <AssisMessageList
                  key={index}
                  messages={message.content || []}
                  index={index}
                  messageId={message.id}
                />
              );
            }
          }
          // 其他类型的消息默认使用AssisMessage处理
          return <></>;
        })}
        <ConversationScrollButton />
      </ConversationContent>
    </Conversation>
  );
}
