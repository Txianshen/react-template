import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { ActionsMessage as UserActions } from "./UserActions";
import type { MessageData } from "@/types/chat";

export interface UserMessageProps {
  messages: MessageData[];
  index: number;
  messageId: string;
}

export const UserMessage = ({
  messages,
  index,
  messageId,
}: UserMessageProps) => {
  console.log(messages);
  return (
    <Message key={`${messageId}-${index}`} from="user" className="ml-auto">
      <MessageContent>
        {messages &&
          messages.map((message, messageIndex) => (
            <MessageResponse key={`${messageId}-${index}-${messageIndex}`}>
              {message.content}
            </MessageResponse>
          ))}
      </MessageContent>
      <UserActions />
    </Message>
  );
};
