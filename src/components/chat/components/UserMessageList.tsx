import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import type { Message as MessageType } from "@/types/chat";
export interface UserMessageProps {
  messages: MessageType[];
  index: number;
  messageId: string;
}

export const UserMessageList = ({
  messages,
  index,
  messageId,
}: UserMessageProps) => {
  console.log(messages);
  return (
    <Message key={`${messageId}-${index}`} from="user" className="ml-auto">
      <MessageContent className="text-2xl !bg-cyan-700/10 !border-cyan-400/40  text-white">
        {messages.map((message) => (
          <MessageResponse key={`${messageId}-${index}`}>
            {message?.text}
          </MessageResponse>
        ))}
      </MessageContent>
    </Message>
  );
};
