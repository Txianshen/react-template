import { useEffect, useState } from "react";
import { createTTSSSE } from "@/lib/tts-sse";

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

  useEffect(() => {
    const sse = createTTSSSE({
      session_id,
    });

    sse.onMessage((data: TTSMessageData) => {
      setTtsMessage(data.msg);
      setIsVisible(true);

      // 5秒后自动隐藏消息，避免长时间占用屏幕空间
      //   setTimeout(() => {
      //     setIsVisible(false);
      //   }, 5000);
    });

    sse.onError((err) => {
      console.error("TTS SSE error:", err);
    });

    sse.connect();

    // 组件卸载时断开连接
    return () => {
      sse.disconnect();
    };
  }, [session_id]);

  return (
    <div
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
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
      <div className="text-center text-2xl">{ttsMessage}</div>
    </div>
  );
}
