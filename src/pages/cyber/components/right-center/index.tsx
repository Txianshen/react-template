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
import { getPoc } from "@/api/cyber";
import { useEffect, useState } from "react";
import LoadingIcon from "@/assets/icons/loading-icon";

// 定义 RightCenter 组件
export default function RightCenter() {
  const { sessionId } = useCyberStore();
  const [pocList, setPocList] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查sessionId 是否存在
    if (!sessionId) {
      // setError("用户ID或会话ID不存在");
      setLoading(false);
      return;
    }

    const fetchPocList = async () => {
      try {
        setLoading(true);
        // 调用 getPoc 接口获取漏洞列表
        const response = await getPoc(sessionId);
        if (response.data && response.code === 200) {
          setPocList(response.data || "");
        } else {
          setError(response.data?.msg || "获取漏洞列表失败");
        }
      } catch (err) {
        console.error("获取漏洞列表错误:", err);
        setError("获取漏洞列表失败");
      } finally {
        setLoading(false);
      }
    };

    fetchPocList();
  }, [sessionId]);

  return (
    <Conversation className="h-full">
      <ConversationContent className="gap-4">
        <Message from="assistant" className="max-w-[100%]">
          <MessageContent className="message-poc message-content text-white text-2xl w-auto">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                <div className="flex flex-col items-center">
                  <LoadingIcon className="animate-spin" size={128} />
                </div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-2xl">{error}</div>
            ) : (
              <MessageResponse>{pocList}</MessageResponse>
            )}
          </MessageContent>
        </Message>
        <ConversationScrollButton />
      </ConversationContent>
    </Conversation>
  );
}
