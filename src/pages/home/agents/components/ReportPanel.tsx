import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportPanel() {
  const [selectedReport, setSelectedReport] = useState("");

  // 临时模拟数据
  const reportList = ["report_2024-01-15.pdf", "report_2024-01-14.pdf"];

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
          <Select value={selectedReport} onValueChange={setSelectedReport}>
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
  );
}
