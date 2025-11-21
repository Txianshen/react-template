import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface AgentSidebarProps {
  agentType: string;
  agentName: string;
  description: string;
  showAdvancedFeatures?: boolean; // 是否显示综合智能体的高级功能
}

export default function AgentSidebar({
  agentType,
  agentName,
  description,
  showAdvancedFeatures = false,
}: AgentSidebarProps) {
  console.log("agentType,", agentType);
  // 模拟状态管理（后续替换为 Zustand）
  const [isRunning, setIsRunning] = useState(false);
  const [currentModel] = useState("ds_v31");
  const [maxTurns] = useState("50");
  const [selectedHistory, setSelectedHistory] = useState("");
  const [selectedReport, setSelectedReport] = useState("");

  // 临时模拟数据
  const historyList = [
    "新的会话",
    "2024-01-15_10:30:45",
    "2024-01-14_15:20:10",
  ];
  const reportList = ["report_2024-01-15.pdf", "report_2024-01-14.pdf"];

  const handleStart = () => {
    setIsRunning(true);
    toast.success("后台智能体已启动🚀");
  };

  const handleStop = () => {
    setIsRunning(false);
    toast.info("后台智能体已停止💀");
  };

  const refreshReportList = () => {
    toast.info("报告列表已刷新");
  };

  const downloadReport = () => {
    if (!selectedReport) {
      toast.error("请先选择报告文件");
      return;
    }
    toast.success(`正在下载: ${selectedReport}`);
  };

  return (
    <div className="w-80 space-y-4 overflow-y-auto p-4 bg-muted/30 rounded-lg">
      {/* 智能体状态 */}
      <div className="space-y-4 p-4 bg-background rounded-lg border">
        <div className="space-y-2">
          <Label className="text-base font-semibold">智能体说明</Label>
          <Textarea
            value={description}
            readOnly
            className="min-h-[120px] resize-none bg-muted text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm">当前大语言模型</Label>
            <Input value={currentModel} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">最大对话轮数</Label>
            <Input value={maxTurns} readOnly className="bg-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">当前运行智能体</Label>
          <Input value={agentName} readOnly className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">后台运行情况</Label>
          <Input
            value={isRunning ? "[+] 运行中..." : "[-] 未启动..."}
            readOnly
            className={`bg-muted ${isRunning ? "text-green-500" : "text-gray-500"}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleStart}
            disabled={isRunning}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
          >
            启动后台智能体
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isRunning}
            variant="destructive"
          >
            停止后台智能体
          </Button>
        </div>
      </div>

      {/* 综合智能体的高级功能 */}
      {showAdvancedFeatures && (
        <Accordion type="single" collapsible className="space-y-2">
          {/* 历史记录 */}
          <AccordionItem
            value="history"
            className="border rounded-lg bg-background px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              从历史渗透记录继续
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              <div className="space-y-2">
                <Label className="text-sm">选择历史渗透记录</Label>
                <Select
                  value={selectedHistory}
                  onValueChange={setSelectedHistory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择历史记录" />
                  </SelectTrigger>
                  <SelectContent>
                    {historyList.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 当前任务状态 */}
          <AccordionItem
            value="plan"
            className="border rounded-lg bg-background px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              当前任务状态
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="text-muted-foreground">🔍 暂无渗透计划</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 渗透报告下载 */}
          <AccordionItem
            value="report"
            className="border rounded-lg bg-background px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              渗透报告下载
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-3">
              <div className="space-y-2">
                <Label className="text-sm">选择报告文件</Label>
                <Select
                  value={selectedReport}
                  onValueChange={setSelectedReport}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择报告文件" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportList.map((file) => (
                      <SelectItem key={file} value={file}>
                        {file}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={refreshReportList} variant="outline" size="sm">
                  刷新报告列表
                </Button>
                <Button
                  onClick={downloadReport}
                  disabled={!selectedReport}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
                >
                  下载渗透测试报告
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
