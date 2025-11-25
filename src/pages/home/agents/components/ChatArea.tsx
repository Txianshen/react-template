// ChatArea 组件占位符
// 待后端 SSE 接口和消息格式确定后实现
import { ChatInput } from "@/components/chat/components/ChatInput.tsx";
import ChatHistory from "./ChatHistory.tsx";
import type { FileUIPart } from "ai";

export default function ChatArea({ placeholder }: { placeholder: string }) {
  const handleSubmit = (data: { text: string; files: FileUIPart[] }) => {
    // 这里处理提交逻辑
    console.log("提交的消息:", data.text);
  };

  return (
    <div className="flex flex-col h-[680px] bg-muted/30 rounded-lg space-y-4">
      {/* 消息列表区域 - 使用 ChatHistory 组件 */}
      <div className="flex-1 p-4 overflow-y-auto border rounded-md">
        <ChatHistory />
      </div>

      {/* 输入框区域 - 使用 ChatInput 组件 */}
      <ChatInput placeholder={placeholder} onSubmit={handleSubmit} />
    </div>
  );
}
