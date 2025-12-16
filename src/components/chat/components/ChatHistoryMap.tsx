import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
// import { UserMessage } from "@/components/chat/components/UserMessage";
import { UserMessageList } from "@/components/chat/components/UserMessageList";

// import { AssisMessage } from "@/components/chat/components/AssisMessage";
import { AssisMessageList } from "@/components/chat/components/AssisMessageList";
import { useHistoryStore } from "@/store/history";
import { useStreamingStore } from "@/store/streamingStoreState";

import { createMessagesList } from "@/lib/utils";
// import { nanoid } from "nanoid";
// import { mockMessages } from "@/lib/mockMessage";
// 定义 ChatHistory 组件
export default function ChatHistoryMap() {
  // 获取当前对话的消息列表
  const history = useHistoryStore((state) => state.history);
  const messages = createMessagesList(history as any, history.currentId);
  const responses = useStreamingStore((s) => s.responses);
  console.log("responses", responses);
  console.log("messages", messages);
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
            return (
              <AssisMessageList
                key={index}
                messages={message.content || []}
                index={index}
                messageId={message.id}
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
