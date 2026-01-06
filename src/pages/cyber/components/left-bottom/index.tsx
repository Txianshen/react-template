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
import { useEffect } from "react";

// 定义 LeftBottom 组件
export default function LeftBottom() {
  const { userId, sessionId, currentPlan, setCurrentPlan } = useCyberStore();

  useEffect(() => {
    // 检查 userId 和 sessionId 是否存在
    if (!userId || !sessionId) return;

    // 创建计划 SSE 实例（统一使用Fetch SSE，token自动在header中）
    const sse = createAuthPlanSSE({ 
      session_id: sessionId,
      // headers: {
      //   // 可以添加其他自定义header
      //   // "X-User-ID": userId,
      //   // "X-Session-ID": sessionId
      // }
    });

    // 设置消息回调
    sse.onMessage((data) => {
      setCurrentPlan(data);
    });

    // 设置错误回调
    sse.onError((error) => {
      console.error("获取当前计划 SSE 连接错误:", error);
      setCurrentPlan("获取当前计划失败");
    });

    // 连接 SSE
    sse.connect();

    // 清理函数
    return () => {
      sse.disconnect();
    };
  }, [userId, sessionId]);

  return (
    <Conversation className="h-full ">
      <ConversationContent className="gap-4">
        <Message from="assistant" className="">
          <MessageContent className=" message-content text-white text-2xl">
            <MessageResponse>{currentPlan || ""}</MessageResponse>
          </MessageContent>
        </Message>
        <ConversationScrollButton />
      </ConversationContent>
    </Conversation>
  );
}
