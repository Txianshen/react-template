import { useEffect, useState } from "react";
import { createTokenUsageSSE } from "@/lib/token-usage-sse";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCyberStore } from "@/store/cyberStore";

interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
}

interface TokenUsageDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function TokenUsageDrawer({
  open,
  setOpen,
}: TokenUsageDrawerProps) {
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { sessionId } = useCyberStore();

  useEffect(() => {
    if (!open) return;

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
  }, [open, sessionId]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-[380px] bg-[#0b1220]/95 backdrop-blur-xl border-l border-cyan-400/30 text-cyan-100"
      >
        <SheetHeader>
          <SheetTitle className="text-cyan-300 tracking-wide text-2xl">
            Token 使用情况
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full py-4 px-4">
          {/* {error && (
            <div className="text-red-400 text-sm mb-4">错误: {error}</div>
          )} */}

          {loading && !tokenUsage && !error && (
            <div className="text-cyan-300 text-sm">加载中...</div>
          )}

          {tokenUsage && (
            <div className="space-y-4 text-white">
              <div className="p-4 bg-[#0f1a2e] rounded-lg border border-cyan-400/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-200">输入Token:</span>
                  <span className="font-mono text-lg text-cyan-100">
                    {tokenUsage.total_input_tokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-200">输出Token:</span>
                  <span className="font-mono text-lg text-cyan-100">
                    {tokenUsage.total_output_tokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-cyan-400/20 font-bold">
                  <span className="text-cyan-200">总计Token:</span>
                  <span className="font-mono text-xl text-cyan-300">
                    {tokenUsage.total_tokens.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
