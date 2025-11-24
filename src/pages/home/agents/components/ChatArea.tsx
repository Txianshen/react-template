// ChatArea 组件占位符
// 待后端 SSE 接口和消息格式确定后实现
import { ChatInput } from "./chatInput.tsx";
import type { FileUIPart } from "ai";

export default function ChatArea({ placeholder }: { placeholder: string }) {
  const handleSubmit = (data: { text: string; files: FileUIPart[] }) => {
    // 这里处理提交逻辑
    console.log("提交的消息:", data.text);
  };

  return (
    <div className="flex flex-col h-[680px] bg-muted/30 rounded-lg space-y-4">
      {/* 消息列表区域 - 占位 */}
      <div className="flex-1 p-4 overflow-y-auto border rounded-md">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>聊天区域占位符 - 待实现</p>
        </div>
      </div>

      {/* 输入框区域 - 使用 ChatInput 组件 */}
      <ChatInput placeholder={placeholder} onSubmit={handleSubmit} />
    </div>
  );
}
