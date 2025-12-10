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
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  // const [isSimulating, setIsSimulating] = useState(false);

  // 当语音识别按钮的状态改变时，同步控制音频可视化
  const handleSpeechButtonListeningChange = useCallback(
    (isListening: boolean) => {
      setIsActive(isListening);
    },
    [setIsActive]
  );

  const handleSubmit = async (data: { text: string; files: FileUIPart[] }) => {
    console.log("handleSubmit", data.text);
    // 生成新的 run_id 并保存
    const runId = uuidv4();
    setCurrentRunId(runId);

    await fetchEventSource("http://47.98.234.82:8009/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_type: "apitest",
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
          throw new Error();
        }
      },
      onerror(err) {
        console.error("发生错误", err);
        // 不重连，返回null阻止自动重连
        return null;
      },
    });
  };

  // 暂停对话
  // const handlePause = async () => {
  //   if (!currentRunId) {
  //     console.warn("没有活动的运行ID");
  //     return;
  //   }

  //   await fetch("http://47.98.234.82:8009/api/interrupt", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ run_id: currentRunId }),
  //   });
  //   // 清空历史记录
  //   // clearMessages();
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
        currentRunId={currentRunId}
        onSpeechButtonListeningChange={handleSpeechButtonListeningChange}
      />
    </div>
  );
}
export default LeftTop;
