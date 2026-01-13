import { useEffect, useState } from "react";
import { createTokenUsageSSE } from "@/lib/token-usage-sse";
import { useCyberStore } from "@/store/cyberStore";
import { Gauge } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <Popover open={true}>
        <PopoverTrigger asChild>
          <button className="flex items-center justify-center px-3 h-12 rounded-full border border-cyan-400/60 text-cyan-300 backdrop-blur-md shadow-[0_0_12px_rgba(0,255,255,0.6)] bg-[#0b1220]/80 transition-all gap-2">
            <Gauge className="w-5 h-5" />
            <span className="font-mono text-cyan-200 text-sm">Token</span>
            <span className="font-mono text-cyan-300 text-sm">
              {tokenUsage ? tokenUsage.total_tokens.toLocaleString() : "0"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-72 bg-[#0b1220]/95 backdrop-blur-xl border border-cyan-400/30 p-4 text-cyan-100"
          side="bottom"
          align="end"
        >
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
