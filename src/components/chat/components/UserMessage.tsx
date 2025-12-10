import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
// import { ActionsMessage as UserActions } from "./UserActions";
import type { Message as MessageType } from "@/lib/mockMessage";

export interface UserMessageProps {
  message: MessageType;
  index: number;
  messageId: string;
}

export const UserMessage = ({
  message,
  index,
  messageId,
}: UserMessageProps) => {
  console.log(message);
  return (
    <Message key={`${messageId}-${index}`} from="user" className="ml-auto">
      <MessageContent>
        <MessageResponse key={`${messageId}-${index}`}>
          {message.data?.content}
        </MessageResponse>
      </MessageContent>
      {/* <UserActions /> */}
    </Message>
  );
};
