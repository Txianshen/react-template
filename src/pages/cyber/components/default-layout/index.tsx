import { Suspense, lazy, useState, useRef } from "react";
import DraggableWindow from "@/components/window-panel";
import TokenUsageHUD from "@/components/token-usage-hud";
import { RotateCcw } from "lucide-react";

import Header from "../header";

// 懒加载组件
const Graph = lazy(() => import("@/components/graph"));
const LeftTop = lazy(() => import("../left-top"));
const LeftBottom = lazy(() => import("../left-bottom"));
const RightBottom = lazy(() => import("../right-bottom"));
const RightCenter = lazy(() => import("../right-center"));
const RightTop = lazy(() => import("../right-top"));

interface DefaultLayoutProps {
  scale: number;
}

export default function DefaultLayout({ scale }: DefaultLayoutProps) {
  const rightBottomRef = useRef<any>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleRefresh = () => {
    setRefreshLoading(true);
    // 调用子组件的刷新方法
    if (
      rightBottomRef.current &&
      typeof rightBottomRef.current.refresh === "function"
    ) {
      rightBottomRef.current.refresh();
    }
    // 重置加载状态，给UI一点反馈时间
    setTimeout(() => setRefreshLoading(false), 300);
  };

  const refreshButton = (
    <button
      onClick={handleRefresh}
      className={`cursor-pointer text-white hover:text-gray-300 transition-colors ${refreshLoading ? "animate-spin" : ""}`}
      aria-label="Refresh"
      style={{ width: "32px", height: "32px" }}
    >
      <RotateCcw size={20} />
    </button>
  );

  return (
    <div className="grid h-full grid-cols-[1.2fr_3fr_1.2fr] gap-4">
      {/* 左侧列 - 上下 1:1 布局 */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex-1 rounded-lg p-0 relative">
          <DraggableWindow
            id="left-top"
            title="语音指令"
            layoutBounds="window"
            scale={scale}
          >
            <Suspense fallback={null}>
              <LeftTop />
            </Suspense>
          </DraggableWindow>
        </div>
        <div className="flex-3 relative rounded-lg p-0">
          <DraggableWindow
            id="right-top"
            title="后台终端"
            layoutBounds="window"
            scale={scale}
          >
            <Suspense fallback={null}>
              <RightTop />
            </Suspense>
          </DraggableWindow>
        </div>
      </div>

      {/* 中间列 */}
      <div className="my-4 p-4 flex flex-col relative">
        {/* 网络关系拓扑图graph */}
        <div className="flex-1 mt-4 ">
          <DraggableWindow
            id="graph"
            title="实时网络安全态势感知"
            showHeader={true}
            layoutBounds="window"
            headerComponent={<Header />}
            className="bg-[transparent]"
            scale={scale}
          >
            <div className="relative w-full h-full">
              <TokenUsageHUD scale={scale} />
              <Suspense fallback={null}>
                <Graph />
              </Suspense>
            </div>
          </DraggableWindow>
        </div>
      </div>

      {/* 右侧列 - 上中下 1:1:1 布局 */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex-1 relative rounded-lg p-0">
          <DraggableWindow
            id="left-bottom"
            title="AI决策推理"
            layoutBounds="window"
            scale={scale}
          >
            <Suspense fallback={null}>
              <LeftBottom />
            </Suspense>
          </DraggableWindow>
        </div>
        <div className="flex-1 relative rounded-lg p-0">
          <DraggableWindow
            id="right-center"
            title="漏洞POC"
            layoutBounds="window"
            scale={scale}
          >
            <Suspense fallback={null}>
              <RightCenter />
            </Suspense>
          </DraggableWindow>
        </div>
        <div className="flex-1 relative rounded-lg p-0">
          <DraggableWindow
            id="right-bottom"
            title="浏览器自动化"
            layoutBounds="window"
            scale={scale}
            headerButtons={refreshButton}
          >
            <Suspense fallback={null}>
              <RightBottom ref={rightBottomRef} />
            </Suspense>
          </DraggableWindow>
        </div>
      </div>
    </div>
  );
}
