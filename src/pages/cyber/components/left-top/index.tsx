// 左上角内容区域- 语音输入/文本输入
import CyberInput from "@/components/cyber-input";
import type { FileUIPart } from "ai";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAudioVisualization } from "@/hooks/use-auto-visualization";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useHistoryStore } from "@/store/history";

function LeftTop() {
  const { canvasRef, setIsActive } = useAudioVisualization();
  const addMessage = useHistoryStore((state) => state.addMessage);
  // const addMessageToMap = useHistoryStore((state) => state.addMessageToMap);

  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [cyberInputStatus, setCyberInputStatus] = useState<
    "ready" | "streaming" | "submitted" | "error"
  >("ready");

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
    // 生成新的 run_id 并保存
    const runId = uuidv4();
    setCurrentRunId(runId);

    setCyberInputStatus("submitted");
    setTimeout(() => {
      setCyberInputStatus("streaming");
    }, 100);

    await fetchEventSource("http://47.98.234.82:8009/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // agent_type: "apitest",
        message: data.text,
        run_id: runId,
      }),
      onmessage(msg) {
        // 处理接收到的消息
        console.log("onmessage", msg);
        try {
          const data = JSON.parse(msg.data);
          console.log("onmessage--data", data);
          // 将消息添加到全局历史记录中
          addMessage(data);

          // 如果消息类型为 "agent_message_done"，则重置按钮状态
          if (data.type === "agent_message_done") {
            setCyberInputStatus("ready");
          }
        } catch (error) {
          console.error("解析SSE消息失败:", error);
        }
      },
      onopen: async (response) => {
        if (response.ok) {
          console.log("连接成功");
          return; // 正常连接
        } else {
          // 处理 4xx 或 5xx 错误
          setCyberInputStatus("ready");
          throw new Error();
        }
      },
      onerror(err) {
        console.error("发生错误", err);
        setCyberInputStatus("ready");
        // 不重连，返回null阻止自动重连
        return null;
      },
    });
  };
  // 模拟SSE流数据
  const simulateSSEStream = async () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setCyberInputStatus("submitted");
    setTimeout(() => {
      setCyberInputStatus("streaming");
    }, 100);
    try {
      // 读取chat_message.txt文件内容
      const response = await fetch("/src/lib/chat_message.txt");
      const text = await response.text();

      // 按行分割内容
      const lines = text.split("\n").filter((line) => line.trim() !== "");

      // 逐行处理数据
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            // 提取JSON部分
            const jsonData = line.substring(6); // 移除 "data: " 前缀
            const data = JSON.parse(jsonData);
            console.log("模拟接收数据:", data);

            // 将消息添加到全局历史记录中
            addMessage(data);
            // addMessageToMap(data);
            // 如果消息类型为 "agent_message_done"，则停止模拟并重置按钮状态
            if (data.type === "agent_message_done") {
              // agent_message_done表示 对话结束 需要重置CyberInput的按钮状态
              setCyberInputStatus("ready");
              break;
            }
          } catch (error) {
            console.error("解析模拟SSE消息失败:", error);
          }
        }

        // 添加延迟以模拟流式接收
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error("模拟SSE流数据时出错:", error);
      setCyberInputStatus("ready");
    } finally {
      setIsSimulating(false);
    }
  };
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
        currentRunId={currentRunId}
        onSpeechButtonListeningChange={handleSpeechButtonListeningChange}
        externalStatus={cyberInputStatus}
      />
      {/* 添加模拟按钮 */}
      <button
        onClick={simulateSSEStream}
        disabled={isSimulating}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSimulating ? "模拟中..." : "模拟SSE流数据"}
      </button>
    </div>
  );
}
export default LeftTop;
