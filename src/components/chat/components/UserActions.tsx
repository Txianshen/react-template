import {
  MessageAction,
  MessageActions,
  MessageToolbar,
} from "@/components/ai-elements/message";
import { CopyIcon } from "lucide-react";

export const ActionsMessage = () => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };
  return (
    <MessageToolbar className="justify-end">
      <MessageActions>
        <MessageAction
          label="复制"
          tooltip="复制"
          onClick={() => handleCopy("message.content")}
        >
          <CopyIcon className="size-4" />
        </MessageAction>
      </MessageActions>
    </MessageToolbar>
  );
};
