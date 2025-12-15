import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
// import { ActionsMessage as UserActions } from "./UserActions";
import type { MessageData } from "@/types/chat";
export interface UserMessageProps {
  messages: MessageData[];
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
      {/* "group-[.is-assistant]:border-none", "!text-white", "!bg-[transparent]", */}
      {/* !bg-cyan-500/10 !border-cyan-400/40 */}
      <MessageContent className="text-2xl !bg-cyan-700/10 !border-cyan-400/40  text-white">
        {messages.map((message) => (
          <MessageResponse key={`${messageId}-${index}`}>
            {message?.content}
          </MessageResponse>
        ))}
      </MessageContent>
      {/* <UserActions /> */}
    </Message>
  );
};
