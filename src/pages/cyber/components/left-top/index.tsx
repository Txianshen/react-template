// 左上角内容区域- 语音输入/文本输入
import CyberInput from "@/components/cyber-input";
import type { FileUIPart } from "ai";
import { useAudioVisualization } from "@/hooks/use-auto-visualization";
import { useCallback, useState, useEffect } from "react";
import { useStreamingStore } from "@/store/streamingStoreState";
import { useCyberStore } from "@/store/cyberStore";
import { createSession, listSessions, getSession } from "@/api/cyber";

function LeftTop() {
  const { canvasRef, setIsActive } = useAudioVisualization();
  // const [isSimulating, setIsSimulating] = useState(false);
  const [cyberInputStatus, setCyberInputStatus] = useState<
    "ready" | "streaming" | "submitted" | "error"
  >("ready");

  const apply = useStreamingStore.getState().applySSEEvent;
  const applyUserMessage = useStreamingStore.getState().applyUserMessage;
  const { userId, sessionId, setUserId, setSessionId } = useCyberStore();

  // 创建新会话的辅助函数
  const createNewSession = async () => {
    try {
      const createResponse = await createSession();
      if (
        createResponse &&
        createResponse.code === 200 &&
        createResponse.data?.id
      ) {
        setSessionId(createResponse.data.id);

        return createResponse.data.id;
      } else {
        console.error("Failed to create session on init:", createResponse?.msg);
        return null;
      }
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  };

  // 初始化时检查现有会话，如果存在则使用第一个会话，否则创建新会话
  useEffect(() => {
    const initSession = async () => {
      try {
        // 首先尝试获取现有会话列表
        const response = await listSessions();

        if (
          response &&
          response.code === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          // 如果存在会话，使用第一个会话的信息
          const firstSession = response.data[0];
          setSessionId(firstSession.id);
          console.log("使用现有会话:", firstSession.id);

          // 还需要通过session.id触发获取会话详情接口
          try {
            const sessionDetailResponse = await getSession(firstSession.id);
            if (sessionDetailResponse && sessionDetailResponse.code === 200) {
              const messages = sessionDetailResponse.data?.messages || [];
              useStreamingStore
                .getState()
                .setResponses(messages, firstSession.id);
              console.log("已加载会话消息:", messages.length, "条");
            } else {
              console.error("获取会话详情失败:", sessionDetailResponse?.msg);
            }
          } catch (detailError) {
            console.error("获取会话详情异常:", detailError);
          }
        } else {
          // 如果没有现有会话，创建新会话
          await createNewSession();
        }
      } catch (error) {
        console.error("Error initializing session on init:", error);

        // 如果获取会话列表失败，尝试创建新会话
        await createNewSession();
      }
    };
    initSession();
  }, []);
  // 当语音识别按钮的状态改变时，同步控制音频可视化
  const handleSpeechButtonListeningChange = useCallback(
    (isListening: boolean) => {
      setIsActive(isListening);
    },
    [setIsActive]
  );

  const handleSubmit = async (data: { text: string; files: FileUIPart[] }) => {
    console.log("handleSubmit", data.text);
    if (!data.text.trim()) {
      return;
    }

    // 使用已存在的 sessionId 而不是每次都创建新的 run_id
    if (!sessionId) {
      console.error("Session ID is not initialized");
      return;
    }

    applyUserMessage(data.text, sessionId);

    setCyberInputStatus("submitted");
    setTimeout(() => {
      setCyberInputStatus("streaming");
    }, 100);
    // 使用普通的 fetch 请求替代 fetchEventSource
    try {
      // 从localStorage获取token
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // 如果token存在，添加到请求头
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVICE_URL}/process`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            input: [
              {
                role: "user",
                content: [{ type: "text", text: data.text }],
              },
            ],
            session_id: sessionId,
            // user_id: userId, // 可选，便于区分多用户
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setCyberInputStatus("ready");
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // 处理完整的事件
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // 保留最后一个不完整的事件

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonData = line.substring(6); // 移除 "data: " 前缀
              const data = JSON.parse(jsonData);
              console.log("onmessage--data", data);
              apply(data);

              if (data.object === "response" && data.status === "completed") {
                setCyberInputStatus("ready");
              }
            } catch (error) {
              console.error("解析SSE消息失败:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("请求失败:", error);
      setCyberInputStatus("error");
    }
  };
  // 模拟SSE流数据
  // const simulateSSEStream = async () => {
  //   if (isSimulating) return;

  //   setIsSimulating(true);
  //   setCyberInputStatus("submitted");
  //   setTimeout(() => {
  //     setCyberInputStatus("streaming");
  //   }, 100);
  //   try {
  //     // 读取chat_message.txt文件内容
  //     const response = await fetch("/src/lib/chat_message.txt");
  //     const text = await response.text();

  //     // 按行分割内容
  //     const lines = text.split("\n").filter((line) => line.trim() !== "");

  //     // 逐行处理数据
  //     for (const line of lines) {
  //       if (line.startsWith("data: ")) {
  //         try {
  //           // 提取JSON部分
  //           const jsonData = line.substring(6); // 移除 "data: " 前缀
  //           const data = JSON.parse(jsonData);
  //           console.log("模拟接收数据:", data);

  //           // 将消息添加到全局历史记录中
  //           addMessage(data);
  //           addMessageToMap(data);
  //           // 如果消息类型为 "agent_message_done"，则停止模拟并重置按钮状态
  //           if (data.type === "agent_message_done") {
  //             // agent_message_done表示 对话结束 需要重置CyberInput的按钮状态
  //             setCyberInputStatus("ready");
  //             break;
  //           }
  //         } catch (error) {
  //           console.error("解析模拟SSE消息失败:", error);
  //         }
  //       }

  //       // 添加延迟以模拟流式接收
  //       await new Promise((resolve) => setTimeout(resolve, 300));
  //     }
  //   } catch (error) {
  //     console.error("模拟SSE流数据时出错:", error);
  //     setCyberInputStatus("ready");
  //   } finally {
  //     setIsSimulating(false);
  //   }
  // };

  // const simulateSSEStream2 = async () => {
  //   if (isSimulating) return;
  //   applyUserMessage("开始", "222");
  //   setIsSimulating(true);
  //   setCyberInputStatus("submitted");
  //   setTimeout(() => {
  //     setCyberInputStatus("streaming");
  //   }, 100);

  //   try {
  //     // 读取chat_mes_scope.txt文件内容
  //     const response = await fetch("/src/lib/chat_mes_scope.txt");
  //     const text = await response.text();

  //     // 按行分割内容并过滤空行
  //     const lines = text.split("\n").filter((line) => line.trim() !== "");

  //     // 逐行处理数据
  //     for (const line of lines) {
  //       if (line.startsWith("data: ")) {
  //         try {
  //           // 解析JSON数据
  //           // 提取JSON部分
  //           const jsonData = line.substring(6); // 移除 "data: " 前缀
  //           const data = JSON.parse(jsonData);
  //           console.log("模拟接收数据:", data);

  //           apply(data);
  //           if (data.object === "response" && data.status === "completed") {
  //             setCyberInputStatus("ready");
  //             // 主动断开
  //             // controller.abort(); // 主动结束
  //           }
  //         } catch (error) {
  //           console.error("解析模拟SSE消息失败:", error);
  //         }
  //       }

  //       // 添加延迟以模拟流式接收
  //       await new Promise((resolve) => setTimeout(resolve, 300));
  //     }
  //   } catch (error) {
  //     console.error("模拟SSE流数据时出错:", error);
  //     setCyberInputStatus("ready");
  //   } finally {
  //     setIsSimulating(false);
  //   }
  // };
  return (
    <div className="flex flex-col h-full text-white text-[28px] ">
      <div className="flex-1 flex items-center justify-center ">
        {/* 波形区域 */}
        <div className="w-full h-40 rounded-md overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
      <CyberInput
        onSubmit={(data) => handleSubmit(data)}
        placeholder="请输入指令"
        currentRunId={sessionId}
        onSpeechButtonListeningChange={handleSpeechButtonListeningChange}
        externalStatus={cyberInputStatus}
      />
      {/* 添加模拟按钮 */}
      {/* <button
        onClick={simulateSSEStream}
        disabled={isSimulating}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSimulating ? "模拟中..." : "模拟SSE流数据"}
      </button> */}
      {/* <button
        onClick={simulateSSEStream2}
        disabled={isSimulating}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSimulating ? "模拟中..." : "模拟SSE流数据"}
      </button> */}
    </div>
  );
}
export default LeftTop;
