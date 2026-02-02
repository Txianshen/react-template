import { PromptInputSpeechButton } from "@/components/ai-elements/prompt-input";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
} from "@/components/ai-elements/prompt-input";
import type { FileUIPart } from "ai";
import { SendHorizontal, Square, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCyberStore } from "@/store/cyberStore";
import { interruptAgent } from "@/api/cyber";

export type CyberInputProps = {
  placeholder?: string;
  onSubmit: (data: { text: string; files: FileUIPart[] }) => void;
  onSpeechButtonListeningChange?: (isListening: boolean) => void; // 新增属性
  // currentRunId?: string | null; // 添加 currentRunId 属性
  externalStatus?: "ready" | "streaming" | "submitted" | "error"; // 添加外部控制状态的属性
};

export default function CyberInput({
  placeholder,
  onSubmit,
  onSpeechButtonListeningChange,
  externalStatus,
}: CyberInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  // 从 cyberStore 获取 userId 和 sessionId
  const { sessionId } = useCyberStore();

  // 当外部状态变化时，更新内部状态
  useEffect(() => {
    if (externalStatus) {
      setStatus(externalStatus);
    }
  }, [externalStatus]);

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
  const handlePause = async () => {
    try {
      // 检查 userId 和 sessionId 是否存在
      if (!sessionId) {
        console.error("sessionId");
        // setStatus("error");
        return;
      }

      // 调用新的暂停API
      const response = await interruptAgent(sessionId);

      if (response) {
        console.log("暂停成功，状态重置为 ready");
        setStatus("ready");
      } else {
        console.error("暂停失败");
        setStatus("error");
      }
    } catch (error) {
      console.error("暂停请求出错:", error);
      setStatus("error");
    }
  };
  const handleSubmit = async (data: { text: string; files: FileUIPart[] }) => {
    // 如果当前状态是 streaming，则触发暂停
    if (status === "streaming") {
      console.log("暂停功能触发");
      await handlePause();
      return;
    }
    console.log("handleSubmit", data);
    onSubmit(data);
  };

  return (
    <div className="px-3 py-2.5 bg-[#27272a] rounded-lg">
      <PromptInputProvider>
        <PromptInput onSubmit={handleSubmit} className="w-full">
          <PromptInputSpeechButton
            onTranscriptionChange={(text: string) => {
              console.log("onTranscriptionChange", text);
            }}
            onListeningChange={onSpeechButtonListeningChange} // 传递给子组件
            textareaRef={textareaRef}
            className="mr-2"
          />
          <PromptInputTextarea
            placeholder={placeholder}
            ref={textareaRef}
            className="flex-1 bg-muted rounded-lg border min-h-0 placeholder:text-[24px] !text-[24px]"
          />
          <PromptInputSubmit className="rounded-full ml-2" status={status}>
            {getSubmitIcon()}
          </PromptInputSubmit>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}
