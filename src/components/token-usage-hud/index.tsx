import { useEffect, useState } from "react";
import { createTokenUsageSSE } from "@/lib/token-usage-sse";
import { useCyberStore } from "@/store/cyberStore";
import { Gauge } from "lucide-react";
import { Rnd } from "react-rnd";

interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
}

export default function TokenUsageHUD() {
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sessionId } = useCyberStore();

  useEffect(() => {
    const sse = createTokenUsageSSE({
      session_id: sessionId || undefined,
    });

    sse.onMessage((data: TokenUsageData) => {
      console.log("Token usage data:", data);
      setTokenUsage(data);
      setLoading(false);
    });

    sse.onError((err) => {
      console.error("Token usage SSE error:", err);
      setError(err.message || "获取token使用情况失败");
      setLoading(false);
    });

    sse.connect();

    // 组件卸载时断开连接
    return () => {
      sse.disconnect();
    };
  }, [sessionId]);

  const [position, setPosition] = useState({ x: 20, y: 20 }); // 默认位置

  return (
    <Rnd
      bounds="window"
      size={{ width: 320, height: "auto" }}
      position={position}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      minWidth={280}
      minHeight={100}
      dragHandleClassName="drag-handle"
      className="z-[9999]"
      style={{ pointerEvents: "auto" }}
    >
      <div className="w-full h-full bg-[#0b1220]/95 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-4 text-cyan-100">
        {/* 拖拽手柄 */}
        <div className="drag-handle flex justify-between items-center mb-4 cursor-move pb-2 border-b border-cyan-400/30">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-cyan-300 text-sm font-semibold">
              Token 使用情况
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-200 text-sm">总:</span>
            <span className="font-mono text-cyan-300 text-sm">
              {tokenUsage ? tokenUsage.total_tokens.toLocaleString() : "0"}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {/* {error && <div className="text-red-400 text-sm">错误: {error}</div>} */}

          {loading && !tokenUsage && !error && (
            <div className="text-cyan-300 text-sm">加载中...</div>
          )}

          {tokenUsage && (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#0f1a2e] rounded-lg border border-cyan-400/20">
                <span className="text-cyan-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />{" "}
                  输入Token:
                </span>
                <span className="font-mono text-base text-cyan-100">
                  {tokenUsage.total_input_tokens.toLocaleString()}
                </span>
              </div>

              {/* 分隔符 */}
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>

              <div className="flex justify-between items-center p-3 bg-[#0f1a2e] rounded-lg border border-cyan-400/20">
                <span className="text-cyan-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />{" "}
                  输出Token:
                </span>
                <span className="font-mono text-base text-cyan-100">
                  {tokenUsage.total_output_tokens.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-[#1a2a4a] rounded-lg border border-cyan-400/40 font-bold">
                <span className="text-cyan-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full" />{" "}
                  总计Token:
                </span>
                <span className="font-mono text-lg text-cyan-300">
                  {tokenUsage.total_tokens.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Rnd>
  );
}
