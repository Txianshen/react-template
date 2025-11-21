import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface StatusPanelProps {
  agentName: string;
  description: string;
}

export default function StatusPanel({
  agentName,
  description,
}: StatusPanelProps) {
  // 模拟状态管理（后续替换为 Zustand）
  const [isRunning, setIsRunning] = useState(false);
  const [currentModel] = useState("ds_v31");
  const [maxTurns] = useState("50");

  const handleStart = () => {
    setIsRunning(true);
    toast.success("后台智能体已启动🚀");
  };

  const handleStop = () => {
    setIsRunning(false);
    toast.info("后台智能体已停止💀");
  };

  return (
    <AccordionItem value="status" className="border rounded-lg  ">
      <AccordionTrigger className="hover:no-underline">
        当前智能体状态
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-0">
        <div className="space-y-2 border rounded-md py-2.5 px-3">
          <Label className="text-sm">智能体说明</Label>
          <Textarea
            value={description}
            readOnly
            className="min-h-[120px] resize-none bg-muted text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 border rounded-md py-2.5 px-3">
          <div className="space-y-2">
            <Label className="text-sm">当前大语言模型</Label>
            <Input value={currentModel} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">最大对话轮数</Label>
            <Input value={maxTurns} readOnly className="bg-muted" />
          </div>
        </div>

        <div className="space-y-2 border rounded-md py-2.5 px-3">
          <Label className="text-sm">当前运行智能体</Label>
          <Input value={agentName} readOnly className="bg-muted" />
          <Label className="text-sm">后台运行情况</Label>
          <Input
            value={isRunning ? "[+] 运行中..." : "[-] 未启动..."}
            readOnly
            className={`bg-muted`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleStart}
            disabled={isRunning}
            className="text-[#fff] bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 rounded-full"
          >
            启动后台智能体
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isRunning}
            variant="destructive"
            className="rounded-full"
          >
            停止后台智能体
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
