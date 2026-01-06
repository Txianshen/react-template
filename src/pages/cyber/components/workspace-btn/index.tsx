import { LayoutGrid, Settings, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function WorkspaceButton({
  onOpenSettings,
  onOpenSessions,
}: {
  onOpenSettings: () => void;
  onOpenSessions: () => void;
}) {
  return (
    <>
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button
            className={cn(
              "fixed top-6 right-20 z-[100] px-3 py-3 rounded-full flex items-center justify-center gap-2",
              "border border-cyan-400/60 text-cyan-300 backdrop-blur-md",
              "shadow-[0_0_12px_rgba(0,255,255,0.6)]",
              "animate-glowPulse",
              "bg-[#0b1220]/80 hover:bg-[#0b1220]/90 transition-all"
            )}
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="bottom"
          align="end"
          className="w-48 bg-[#0b1220]/95 backdrop-blur-xl border border-cyan-400/30 p-2"
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-cyan-100 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>模型设置</span>
            </button>
            <button
              onClick={onOpenSessions}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-cyan-100 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>会话历史</span>
            </button>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* 动画 keyframes */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(0,255,255,0.6); }
          50% { box-shadow: 0 0 20px rgba(0,255,255,1); }
        }
        .animate-glowPulse { animation: glowPulse 2.4s infinite ease-in-out; }
      `}</style>
    </>
  );
}
