import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { useCyberStore } from "@/store/cyberStore";
import { createAuthPlanSSE } from "@/lib/auth-plan-sse";
import { useEffect, useState, useRef } from "react";
export default function LeftBottom() {
  const { sessionId } = useCyberStore();

  // 1. 用于显示的 State
  const [displayPlan, setDisplayPlan] = useState<string>("");

  // 2. 用于接收最新数据的 Ref (就像一个暂存箱，写入没有任何性能开销)
  const latestDataRef = useRef<string>("");

  // 3. 动画帧 ID，用于清理
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // --- SSE 连接逻辑 ---
    const sse = createAuthPlanSSE({ session_id: sessionId });

    sse.onMessage((data) => {
      // 关键点 A: SSE 来了只管往 Ref 里塞，绝不直接触发 State 更新！
      // 这是一个同步操作，耗时几乎为 0
      console.log("Received new data:", data);
      latestDataRef.current = data;
    });

    sse.onError((error) => {
      console.error("SSE Error:", error);
    });

    sse.connect();

    // --- 渲染循环逻辑 (这是流畅的核心) ---
    const loop = () => {
      // 关键点 B: 在每一帧绘制前，检查 Ref 里有没有新数据
      // 这种方式会自动适应浏览器的刷新率 (60fps 或 120fps)
      setDisplayPlan((prev) => {
        // 只有当数据真的变了才更新，避免无效渲染
        if (latestDataRef.current !== prev) {
          return latestDataRef.current;
        }
        return prev;
      });

      // 继续下一帧
      rafIdRef.current = requestAnimationFrame(loop);
    };

    // 启动循环
    loop();

    // --- 清理函数 ---
    return () => {
      sse.disconnect();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [sessionId]);

  return (
    <Conversation className="h-full">
      <ConversationContent className="gap-4">
        <Message from="assistant">
          <MessageContent className="message-content text-white text-2xl">
            {/* 这里直接显示 displayPlan */}
            <MessageResponse key={displayPlan.length}>
              {displayPlan}
            </MessageResponse>
          </MessageContent>
        </Message>
        <ConversationScrollButton />
      </ConversationContent>
    </Conversation>
  );
}
