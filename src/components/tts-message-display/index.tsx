import { useEffect, useState, useRef } from "react";
import { createTTSSSE } from "@/lib/tts-sse";
import { TTSManager } from "@/lib/tts-manager";

interface TTSMessageData {
  msg: string;
}

interface TTSMessageDisplayProps {
  session_id?: string;
  className?: string;
}

export default function TTSMessageDisplay({
  session_id,
  className = "",
}: TTSMessageDisplayProps) {
  const [ttsMessage, setTtsMessage] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // 初始化TTS管理器
  const ttsManager = useRef<TTSManager>(new TTSManager());

  useEffect(() => {
    const sse = createTTSSSE({
      session_id,
    });

    sse.onMessage((data: TTSMessageData) => {
      setTtsMessage(data.msg);
      setIsVisible(true);
      // 添加到TTS管理器进行语音播放
      ttsManager.current.addText(data.msg);
    });

    sse.onError((err) => {
      console.error("TTS SSE error:", err);
    });

    sse.connect();

    // 组件卸载时断开连接
    return () => {
      sse.disconnect();
      // 取消所有语音合成
      ttsManager.current.cancel();
    };
  }, [session_id]);

  return (
    <div
      className={`fixed bottom-24 z-1000000 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
      style={{
        maxWidth: "80%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "24px 24px",
        borderRadius: "24px",
      }}
    >
      <div className="text-center text-5xl">{ttsMessage}</div>
    </div>
  );
}
