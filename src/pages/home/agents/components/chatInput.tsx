import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
} from "@/components/ai-elements/prompt-input";
import type { FileUIPart } from "ai";
import { SendHorizontal, Square, X, Loader2 } from "lucide-react";
import { useState } from "react";

export type ChatInputProps = {
  placeholder?: string;
  onSubmit: (data: { text: string; files: FileUIPart[] }) => void;
};

export function ChatInput({ placeholder, onSubmit }: ChatInputProps) {
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  // 根据status状态决定显示什么图标
  const getSubmitIcon = () => {
    switch (status) {
      case "submitted":
        return <Loader2 className="size-4 animate-spin" />;
      case "streaming":
        return <Square className="size-4" />;
      case "error":
        return <X className="size-4" />;
      default:
        return <SendHorizontal className="size-4" />;
    }
  };

  const handleSubmit = (data: { text: string; files: FileUIPart[] }) => {
    // 更新状态为提交中
    setStatus("submitted");
    setTimeout(() => {
      setStatus("streaming");
    }, 1000);
    setTimeout(() => {
      setStatus("ready");
    }, 2000);

    // 调用外部传入的onSubmit处理函数
    onSubmit(data);
  };

  return (
    <div className="px-3 py-2.5 bg-[#27272a] rounded-lg">
      <PromptInputProvider>
        <PromptInput onSubmit={handleSubmit} className="w-full">
          <PromptInputTextarea
            placeholder={placeholder}
            className="flex-1 bg-muted rounded-lg border min-h-0"
          />
          <PromptInputSubmit className="rounded-full" status={status}>
            {getSubmitIcon()}
          </PromptInputSubmit>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}
