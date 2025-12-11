import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GlowSettingsButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          "fixed top-6 right-6 z-100000 px-5 py-2 rounded-full flex items-center gap-2",
          "border border-cyan-400/60 text-cyan-300 backdrop-blur-md",
          "shadow-[0_0_12px_rgba(0,255,255,0.6)]",
          "animate-glowPulse"
        )}
      >
        <Settings className="w-5 h-5" />
        {/* <span className="tracking-wide">模型设置</span> */}
      </button>

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
