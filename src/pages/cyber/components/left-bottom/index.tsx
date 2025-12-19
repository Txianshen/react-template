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
import { useEffect } from "react";

// 定义 LeftBottom 组件
export default function LeftBottom() {
  const { userId, sessionId, currentPlan, setCurrentPlan } = useCyberStore();

  useEffect(() => {
    // 检查 userId 和 sessionId 是否存在
    if (!userId || !sessionId) return;

    // 定义获取计划的函数
    const fetchCurrentPlan = async () => {
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
        // 注意：即使失败也继续轮询
      }
    };

    // 立即调用一次
    fetchCurrentPlan();

    // 每5秒调用一次
    const intervalId = setInterval(fetchCurrentPlan, 5000);

    // 清理函数
    return () => {
      clearInterval(intervalId);
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
