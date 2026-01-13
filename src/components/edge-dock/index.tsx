import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bug, Shield } from "lucide-react";
import { toast } from "sonner";
import { useCyberStore } from "@/store/cyberStore";
import { getPoc } from "@/api/cyber";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EdgeDock() {
  const { sessionId } = useCyberStore();
  const [pocData, setPocData] = useState<string>("");
  const [pocLoading, setPocLoading] = useState<boolean>(false);
  const [isDockOpen, setIsDockOpen] = useState<boolean>(false); // 扩展坞状态
  const [activeModal, setActiveModal] = useState<"poc" | "security" | null>(
    null
  ); // 当前激活的模态框

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
    setActiveModal("poc");
    toast.info("正在获取漏洞POC信息...");
  };

  const handleSecurityClick = () => {
    setActiveModal("security");
    toast.info("打开实时网络安全态势感知...");
    // 这里可以添加打开安全态势模块的逻辑
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setPocData(""); // 清空POC数据
  };

  return (
    <>
      {/* 右侧边缘扩展坞 - 三层级交互系统 */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 flex z-[1000]">
        {/* 第一层级：常态/静默态 - 极窄手柄 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="w-5 h-24 bg-gradient-to-b from-cyan-500/30 to-blue-500/30 cursor-pointer flex items-center justify-center group"
                onClick={() => setIsDockOpen(!isDockOpen)}
              >
                {/* 改进的呼吸灯效果 */}
                <div className="w-2.5 h-12 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(56,189,248,0.8)]"></div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="bg-gray-900 text-cyan-300 border border-cyan-400/30"
            >
              <span>{isDockOpen ? "收起扩展坞" : "展开扩展坞"}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 第二层级：扩展态/就绪态 - 功能面板 */}
        <div
          className={`flex flex-col gap-3 bg-[#0b1220]/80 backdrop-blur-md p-2 rounded-l-lg border border-cyan-400/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDockOpen ? "w-14 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-2 overflow-hidden"}`}
        >
          {/* 漏洞POC按钮 */}
          <Button
            onClick={handlePocClick}
            className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
              activeModal === "poc"
                ? "bg-red-600/80 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-red-600/50 border-red-400/30 hover:bg-red-600/70"
            }`}
            title="漏洞POC"
          >
            <Bug className="w-5 h-5 text-white" />
          </Button>

          {/* 网络安全态势按钮 */}
          <Button
            onClick={handleSecurityClick}
            className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
              activeModal === "security"
                ? "bg-blue-600/80 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "bg-blue-600/50 border-blue-400/30 hover:bg-blue-600/70"
            }`}
            title="网络安全态势"
          >
            <Shield className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* 第三层级：激活态/沉浸态 - 模态框 */}
      <Dialog open={activeModal !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md bg-[#0b1220] border border-cyan-400/30 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cyan-300">
              {activeModal === "poc" ? "漏洞POC信息" : "网络安全态势"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            {activeModal === "poc" && (
              <div className="text-cyan-100 whitespace-pre-wrap">
                {pocLoading ? "加载中..." : pocData || "暂无POC数据"}
              </div>
            )}
            {activeModal === "security" && (
              <div className="text-cyan-100">
                网络安全态势感知数据将在后续版本中实现...
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleCloseModal}
              className="text-cyan-400 hover:text-cyan-300 border border-cyan-400/30"
            >
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
