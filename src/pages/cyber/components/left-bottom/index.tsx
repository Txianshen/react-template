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
import { getCurrentPlan } from "@/api/cyber";
import { useEffect, useRef } from "react";

// 定义 LeftBottom 组件
export default function LeftBottom() {
  const { userId, sessionId, currentPlan, setCurrentPlan } = useCyberStore();

  // 使用 ref 来跟踪是否应该继续轮询
  const shouldContinuePolling = useRef(true);

  useEffect(() => {
    // 检查 userId 和 sessionId 是否存在
    if (!userId || !sessionId) return;

    // 重置轮询标志
    shouldContinuePolling.current = true;

    // 定义获取计划的函数
    const fetchCurrentPlan = async () => {
      // 如果不应该继续轮询，则清除定时器
      if (!shouldContinuePolling.current) {
        return;
      }

      try {
        const response = await getCurrentPlan(userId, sessionId);
        // 假设响应数据在 response.data 中
        if (response.data) {
          setCurrentPlan(response.data);
        }
      } catch (error) {
        console.error("获取当前计划失败:", error);
        // 如果获取失败，清空当前计划
        setCurrentPlan("获取当前计划失败");
        // 停止继续轮询
        shouldContinuePolling.current = false;
      }
    };

    // 立即调用一次
    fetchCurrentPlan();

    // 每5秒调用一次
    const intervalId = setInterval(fetchCurrentPlan, 5000);

    // 清理函数
    return () => {
      clearInterval(intervalId);
      shouldContinuePolling.current = false;
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
