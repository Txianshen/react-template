import {
  MessageAction,
  MessageActions,
  MessageToolbar,
} from "@/components/ai-elements/message";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";

export const ActionsMessage = () => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };
  const handleRetry = () => {
    console.log("Retrying...");
  };
  return (
    <MessageToolbar>
      <MessageActions>
        <MessageAction
          label="重新生成"
          onClick={handleRetry}
          tooltip="重新生成"
        >
          <RefreshCcwIcon className="size-4" />
        </MessageAction>
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
