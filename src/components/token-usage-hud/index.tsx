import { useEffect, useState, useLayoutEffect } from "react";
import { createTokenUsageSSE } from "@/lib/token-usage-sse";
import { useCyberStore } from "@/store/cyberStore";
import { Gauge } from "lucide-react";
import { Rnd } from "react-rnd";
import { useNumberAnimation } from "@/hooks/useNumberAnimation";

interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_account: number;
  average_time: number;
}

// 用于处理可能缺失字段的临时接口
interface PartialTokenUsageData {
  total_input_tokens?: number;
  total_output_tokens?: number;
  total_tokens?: number;
  total_account?: number;
  average_time?: number;
}

interface TokenUsageHUDProps {
  scale?: number;
}

export default function TokenUsageHUD({ scale = 1 }: TokenUsageHUDProps) {
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 数字动画值
  const animatedInputTokens = useNumberAnimation(
    tokenUsage?.total_input_tokens || 0
  );
  const animatedOutputTokens = useNumberAnimation(
    tokenUsage?.total_output_tokens || 0
  );
  const animatedTotalTokens = useNumberAnimation(tokenUsage?.total_tokens || 0);
  const animatedAccount = useNumberAnimation(tokenUsage?.total_account || 0, {
    decimals: 2,
  });
  const animatedAverageTime = useNumberAnimation(
    tokenUsage?.average_time || 0,
    { decimals: 1 }
  );

  const { sessionId } = useCyberStore();

  useEffect(() => {
    const sse = createTokenUsageSSE({
      session_id: sessionId || undefined,
    });

    sse.onMessage((data: PartialTokenUsageData) => {
      console.log("Token usage data:", data);
      // 确保新字段存在，如果不存在则设为默认值
      const normalizedData: TokenUsageData = {
        total_input_tokens: data.total_input_tokens || 0,
        total_output_tokens: data.total_output_tokens || 0,
        total_tokens: data.total_tokens || 0,
        total_account: data.total_account || 0,
        average_time: data.average_time || 0,
      };
      setTokenUsage(normalizedData);
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

  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const HUD_WIDTH = 320;

  useLayoutEffect(() => {
    if (position) return;

    // 将位置设置为相对于父容器的左上角偏移 (10px, 20px)
    const x = 20;
    const y = 0;

    setPosition({ x, y });
  }, []);

  useEffect(() => {
    if (!position) return;

    const onResize = () => {
      // 窗口大小改变时不改变位置，保持相对左上角的固定偏移
      // 如果用户已经拖动过组件，则保持当前位置不变
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scale]);

  return (
    <>
      <Rnd
        bounds="window"
        size={{ width: HUD_WIDTH, height: "auto" }}
        position={position ?? { x: 0, y: 0 }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        minWidth={280}
        minHeight={100}
        dragHandleClassName="drag-handle"
        className="z-[9999]"
        enableResizing={false}
        style={{ pointerEvents: "auto" }}
        scale={scale}
      >
        <div className="w-full h-full bg-[#0b1220]/95 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-4 text-cyan-100">
          {/* 拖拽手柄 */}
          <div className="drag-handle flex justify-between items-center mb-4 cursor-move pb-2 border-b border-cyan-400/30">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-cyan-300 text-xl font-semibold">
                统计数据
              </span>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-200 text-lg">总:</span>
              <span className="font-mono text-cyan-300 text-lg">
                {tokenUsage ? tokenUsage.total_tokens.toLocaleString() : "0"}
              </span>
            </div> */}
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
                    <span className="w-2 h-2 bg-blue-400 rounded-full text-lg" />{" "}
                    输入Token:
                  </span>
                  <span className="font-mono text-cyan-300 text-lg">
                    {animatedInputTokens.toLocaleString()}
                  </span>
                </div>

                {/* 分隔符 */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>

                <div className="flex justify-between items-center p-3 bg-[#0f1a2e] rounded-lg border border-cyan-400/20">
                  <span className="text-cyan-200 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full text-lg" />{" "}
                    输出Token:
                  </span>
                  <span className="font-mono text-base text-cyan-300 text-lg">
                    {animatedOutputTokens.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#0f1a2e] rounded-lg border border-cyan-400/40">
                  <span className="text-cyan-200 flex items-center gap-1 ">
                    <span className="w-2 h-2 bg-purple-400 rounded-full text-lg" />
                    总计Token:
                  </span>
                  <span className="font-mono text-lg text-cyan-300 text-lg">
                    {animatedTotalTokens.toLocaleString()}
                  </span>
                </div>

                {/* 总花费金额 */}
                <div className="flex justify-between items-center p-3 bg-[#0f1a2e] rounded-lg border border-cyan-400/20">
                  <span className="text-cyan-200 flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full text-lg" />
                    大模型API调用金额:
                  </span>
                  <span className="font-mono text-cyan-300 text-lg">
                    ¥{animatedAccount.toFixed(2)}
                  </span>
                </div>

                {/* 平均攻克时间 */}
                <div className="flex justify-between items-center p-3 bg-[#0f1a2e] rounded-lg border border-cyan-400/20">
                  <span className="text-cyan-200 flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full text-lg" />
                    靶场平均攻克时间:
                  </span>
                  <span className="font-mono text-cyan-300 text-lg">
                    {animatedAverageTime.toFixed(1)}分钟
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Rnd>
    </>
  );
}
