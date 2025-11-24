// ChatArea 组件占位符
// 待后端 SSE 接口和消息格式确定后实现
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputProvider,
} from "@/components/ai-elements/prompt-input";
import type { FileUIPart } from "ai";
import { SendHorizontal, Square, X, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ChatArea({ placeholder }: { placeholder: string }) {
  const handleSubmit = (data: { text: string; files: FileUIPart[] }) => {
    // 这里处理提交逻辑
    console.log("提交的消息:", data.text);
    // 模拟提交按钮的变化
    setStatus("submitted");
    setTimeout(() => {
      setStatus("streaming");
    }, 500);

    setTimeout(() => {
      setStatus("ready");
    }, 1000);
  };

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

  return (
    <div className="flex flex-col h-[680px] bg-muted/30 rounded-lg space-y-4">
      {/* 消息列表区域 - 占位 */}
      <div className="flex-1 p-4 overflow-y-auto border rounded-md">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>聊天区域占位符 - 待实现</p>
        </div>
      </div>

      {/* 输入框区域 - 使用 PromptInput 组件 */}
      <div className="px-3 py-2.5 bg-[#27272a] rounded-lg ">
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
    </div>
  );
}
