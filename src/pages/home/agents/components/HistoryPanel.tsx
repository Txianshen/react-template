import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function HistoryPanel() {
  const [selectedHistory, setSelectedHistory] = useState("");

  // 临时模拟数据
  const historyList = [
    "新的会话",
    "2024-01-15_10:30:45",
    "2024-01-14_15:20:10",
  ];

  return (
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
          <Select value={selectedHistory} onValueChange={setSelectedHistory}>
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
  );
}
