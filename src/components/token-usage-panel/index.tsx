import { useEffect, useState } from "react";
import { createTokenUsageSSE } from "@/lib/token-usage-sse";

interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
}

interface TokenUsagePanelProps {
  session_id?: string;
  className?: string;
}

export default function TokenUsagePanel({
  session_id,
  className = "",
}: TokenUsagePanelProps) {
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sse = createTokenUsageSSE({
      session_id,
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
  }, [session_id]);

  return (
    <div className={`p-4 ${className}`}>
      {/* <h3 className="text-lg font-semibold mb-3">Token 使用情况</h3> */}

      {/* {error && <div className="text-red-500 text-sm">错误: {error}</div>} */}

      {loading && !tokenUsage && !error && (
        <div className="text-gray-500 text-sm">加载中...</div>
      )}

      {tokenUsage && (
        <div className="space-y-2 text-white text-xl">
          <div className="flex justify-between">
            <span>输入Token:</span>
            <span className="font-mono">
              {tokenUsage.total_input_tokens.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>输出Token:</span>
            <span className="font-mono">
              {tokenUsage.total_output_tokens.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>总计Token:</span>
            <span className="font-mono">
              {tokenUsage.total_tokens.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
