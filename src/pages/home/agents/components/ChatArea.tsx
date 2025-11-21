// ChatArea 组件占位符
// 待后端 SSE 接口和消息格式确定后实现

export default function ChatArea({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-lg border">
      {/* 消息列表区域 - 占位 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>聊天区域占位符 - 待实现</p>
        </div>
      </div>

      {/* 输入框区域 - 占位 */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 px-4 py-2 bg-muted rounded-lg border"
            disabled
          />
          <button
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
            disabled
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
