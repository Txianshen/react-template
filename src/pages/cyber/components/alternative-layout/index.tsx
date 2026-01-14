import { Suspense, lazy, useRef } from "react";
import DraggableWindow from "@/components/window-panel";
import EdgeDock from "@/components/edge-dock";
import { RefreshCw } from "lucide-react";

// 懒加载组件
const LeftTop = lazy(() => import("../left-top")); // 语音指令
const RightTop = lazy(() => import("../right-top")); // 后台终端
const RightBottom = lazy(() => import("../right-bottom")); // 浏览器自动化
const LeftBottom = lazy(() => import("../left-bottom")); // AI决策推理

interface AlternativeLayoutProps {
  scale: number;
}

export default function AlternativeLayout({ scale }: AlternativeLayoutProps) {
  const rightBottomRef = useRef<any>(null);

  const handleRefresh = async () => {
    // 调用子组件的刷新方法
    if (
      rightBottomRef.current &&
      typeof rightBottomRef.current.refresh === "function"
    ) {
      rightBottomRef.current.refresh();
    }
  };

  const refreshButton = (
    <button
      onClick={handleRefresh}
      className="cursor-pointer text-white hover:text-gray-300 transition-colors"
      aria-label="Refresh"
      style={{ width: "32px", height: "32px" }}
    >
      <RefreshCw size={20} />
    </button>
  );

  return (
    <div className="h-full w-full">
      {/* 主要的左右两列布局 */}
      <div className="grid h-full grid-cols-2 gap-4 p-4">
        {/* 左列：后台终端(上) + 语音指令(下) */}
        <div className="flex flex-col gap-4">
          {/* 后台终端模块 - 上方 */}
          <div className="relative rounded-lg p-0">
            <div className="relative rounded-lg p-0 w-full ">
              {/* 1. 【影子占位符】(Phantom Spacer) 
                它的唯一作用是撑开父级的高度。
                它由两部分组成：Header占位 + Content占位 
            */}
              <div className="flex flex-col invisible pointer-events-none w-full">
                {/* 模拟 Header 的高度 (根据你的 BoxHeader 调整，比如 h-10 或 h-[42px]) */}
                <div className="w-full h-[56.72px] shrink-0"></div>

                {/* 模拟 Content 的比例 (这里设置 16:10) */}
                <div className="w-full aspect-[16/10]"></div>
              </div>
              {/* 2. 【真实组件】 
                绝对定位，铺满上面撑开的空间。
                此时:
                WindowPanel 高度 = Header占位 + 16:10占位
                WindowPanel Header = Header占位
                WindowPanel Content = 16:10占位
                完美对齐！
            */}
              <div className="absolute inset-0">
                <DraggableWindow
                  id="alt-right-top"
                  title="后台终端"
                  layoutBounds="window"
                  scale={scale}
                >
                  <div className="relative w-full h-full">
                    <Suspense fallback={null}>
                      <RightTop />
                    </Suspense>
                  </div>
                </DraggableWindow>
              </div>
            </div>
          </div>

          {/* 语音指令模块 - 下方 */}
          <div className="flex-1 relative rounded-lg p-0">
            <DraggableWindow
              id="alt-left-top"
              title="语音指令"
              layoutBounds="window"
              scale={scale}
            >
              <Suspense fallback={null}>
                <LeftTop />
              </Suspense>
            </DraggableWindow>
          </div>
        </div>

        {/* 右列：浏览器自动化(上) + AI决策推理(下) */}
        <div className="flex flex-col gap-4">
          {/* 浏览器自动化模块 - 上方 */}
          <div className="relative rounded-lg p-0 w-full ">
            {/* 1. 【影子占位符】(Phantom Spacer) 
                它的唯一作用是撑开父级的高度。
                它由两部分组成：Header占位 + Content占位 
            */}
            <div className="flex flex-col invisible pointer-events-none w-full">
              {/* 模拟 Header 的高度 (根据你的 BoxHeader 调整，比如 h-10 或 h-[42px]) */}
              <div className="w-full h-[56.72px] shrink-0"></div>

              {/* 模拟 Content 的比例 (这里设置 16:10) */}
              <div className="w-full aspect-[16/10]"></div>
            </div>
            {/* 2. 【真实组件】 
                绝对定位，铺满上面撑开的空间。
                此时:
                WindowPanel 高度 = Header占位 + 16:10占位
                WindowPanel Header = Header占位
                WindowPanel Content = 16:10占位
                完美对齐！
            */}
            <div className="absolute inset-0">
              <DraggableWindow
                id="alt-right-bottom"
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

          {/* AI决策推理模块 - 下方 */}
          <div className="flex-1 relative rounded-lg p-0">
            <DraggableWindow
              id="alt-left-bottom"
              title="AI决策推理"
              layoutBounds="window"
              scale={scale}
            >
              <Suspense fallback={null}>
                <LeftBottom />
              </Suspense>
            </DraggableWindow>
          </div>
        </div>
      </div>

      <EdgeDock />
    </div>
  );
}
