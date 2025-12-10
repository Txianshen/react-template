import { PromptInputSpeechButton } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
} from "@/components/ai-elements/prompt-input";
import type { FileUIPart } from "ai";
import { SendHorizontal, Square, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

export type CyberInputProps = {
  placeholder?: string;
  onSubmit: (data: { text: string; files: FileUIPart[] }) => void;
  onSpeechButtonListeningChange?: (isListening: boolean) => void; // 新增属性
};

export default function CyberInput({
  placeholder,
  onSubmit,
  onSpeechButtonListeningChange,
}: CyberInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
          <PromptInputSpeechButton
            onTranscriptionChange={(text: string) => {
              console.log(text);
            }}
            onListeningChange={onSpeechButtonListeningChange} // 传递给子组件
            textareaRef={textareaRef}
            className="mr-2"
          />
          <PromptInputTextarea
            placeholder={placeholder}
            ref={textareaRef}
            className="flex-1 bg-muted rounded-lg border min-h-0"
          />
          <PromptInputSubmit className="rounded-full ml-2" status={status}>
            {getSubmitIcon()}
          </PromptInputSubmit>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}
