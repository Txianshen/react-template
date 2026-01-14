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
  const [currentTtsText, setCurrentTtsText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // 初始化TTS管理器
  const ttsManager = useRef<TTSManager>(new TTSManager());

  useEffect(() => {
    // 设置TTSManager的文本变更回调
    ttsManager.current.setOnTextChange(setCurrentTtsText);
    const sse = createTTSSSE({
      session_id,
    });

    sse.onMessage((data: TTSMessageData) => {
      // 仅设置可见性，文本显示将从TTSManager获取
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
      // 清理文本变更回调
      ttsManager.current.setOnTextChange(null);
    };
  }, [session_id, setCurrentTtsText]);

  return (
    currentTtsText && (
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
        <div className="text-center text-5xl">{currentTtsText}</div>
      </div>
    )
  );
}
