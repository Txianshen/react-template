import { useState, Suspense, lazy } from "react";
import DraggableWindow from "@/components/window-panel";
import { Button } from "@/components/ui/button";
import { Bug, Shield } from "lucide-react";
import { useCyberStore } from "@/store/cyberStore";
import { getPoc } from "@/api/cyber";
import { toast } from "sonner";

// 懒加载组件
const LeftTop = lazy(() => import("../left-top")); // 语音指令
const RightTop = lazy(() => import("../right-top")); // 后台终端
const RightBottom = lazy(() => import("../right-bottom")); // 浏览器自动化
const LeftBottom = lazy(() => import("../left-bottom")); // AI决策推理

interface AlternativeLayoutProps {
  scale: number;
}

export default function AlternativeLayout({ scale }: AlternativeLayoutProps) {
  const { sessionId } = useCyberStore();
  const [pocData, setPocData] = useState<string>("");
  const [pocLoading, setPocLoading] = useState<boolean>(false);

  // 获取POC数据
  const fetchPocData = async () => {
    if (!sessionId) return;

    setPocLoading(true);
    try {
      const response: any = await getPoc(sessionId);
      if (response && response.code === 200) {
        setPocData(response.data || "");
      }
    } catch (error) {
      console.error("获取POC数据失败:", error);
    } finally {
      setPocLoading(false);
    }
  };

  const handlePocClick = () => {
    fetchPocData();
    toast.info("正在获取漏洞POC信息...");
  };

  const handleSecurityClick = () => {
    toast.info("打开实时网络安全态势感知...");
    // 这里可以添加打开安全态势模块的逻辑
  };

  return (
    <div className="h-full w-full">
      {/* 主要的左右两列布局 */}
      <div className="grid h-full grid-cols-2 gap-4 p-4">
        {/* 左列：后台终端(上) + 语音指令(下) */}
        <div className="flex flex-col gap-4">
          {/* 后台终端模块 - 上方 */}
          <div className="flex-1 relative rounded-lg p-0">
            <DraggableWindow
              id="alt-right-top"
              title="后台终端"
              layoutBounds="window"
              scale={scale}
            >
              <Suspense fallback={null}>
                <RightTop />
              </Suspense>
            </DraggableWindow>
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
                // 注意：这里传 aspectRatio 主要是为了触发 WindowPanel 内部的一些"非resize"逻辑
                // 但实际尺寸已经由上面的影子决定了
                aspectRatio="16/10"
              >
                <Suspense fallback={null}>
                  <RightBottom />
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

      {/* 右侧固定按钮区域 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        {/* 漏洞POC按钮 */}
        <Button
          onClick={handlePocClick}
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg flex items-center justify-center border-2 border-red-400"
          title="漏洞POC"
        >
          <Bug className="w-6 h-6 text-white" />
        </Button>

        {/* 网络安全态势按钮 */}
        <Button
          onClick={handleSecurityClick}
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg flex items-center justify-center border-2 border-blue-400"
          title="网络安全态势"
        >
          <Shield className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* POC数据显示模态框（简化版） */}
      {pocData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1220] border border-cyan-400/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-cyan-300 text-xl font-bold">漏洞POC信息</h3>
              <Button
                variant="ghost"
                onClick={() => setPocData("")}
                className="text-cyan-400 hover:text-cyan-300"
              >
                关闭
              </Button>
            </div>
            <div className="text-cyan-100 whitespace-pre-wrap">
              {pocLoading ? "加载中..." : pocData || "暂无POC数据"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
