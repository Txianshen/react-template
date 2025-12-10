// 左上角内容区域- 语音输入/文本输入
import CyberInput from "@/components/cyber-input";
import type { FileUIPart } from "ai";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAudioVisualization } from "@/hooks/use-auto-visualization";
import { useCallback } from "react";

function LeftTop() {
  const { canvasRef, setIsActive } = useAudioVisualization();

  // 当语音识别按钮的状态改变时，同步控制音频可视化
  const handleSpeechButtonListeningChange = useCallback(
    (isListening: boolean) => {
      setIsActive(isListening);
    },
    [setIsActive]
  );

  const handleSubmit = async (data: { text: string; files: FileUIPart[] }) => {
    console.log("handleSubmit", data.text);
    await fetchEventSource("http://47.98.234.82:8009/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer token-xxx",
      },
      body: JSON.stringify({
        agent_type: "apitest",
        message: data.text,
        // run_id: uuidv4(),
        run_id: "cc554d15-617b-4c81-9c43-cedf1002db10", // 测试用
      }),
      onmessage(msg) {
        // 处理接收到的消息
        console.log("onmessage", msg);
        const data = JSON.parse(msg.data);
        console.log("onmessage--data", data);
        // if (msg.event === "some-event") {
        //   const data = JSON.parse(msg.data);
        //   console.log(data);
        // }
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
  //   await fetch("http://47.98.234.82:8009/api/interrupt", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ run_id: "cc554d15-617b-4c81-9c43-cedf1002db10" }),
  //   });
  // };

  return (
    <div className="flex flex-col h-full text-white text-[28px] font-[YouSheTitleHei]">
      <div className="flex-1 flex items-center justify-center ">
        {/* 波形区域 */}
        <div className="w-full h-40 rounded-md overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
      <CyberInput
        onSubmit={(data) => handleSubmit(data)}
        placeholder="请输入指令"
        onSpeechButtonListeningChange={handleSpeechButtonListeningChange}
      />
      {/* <button onClick={handlePause}>暂停</button> */}
    </div>
  );
}

export default LeftTop;
