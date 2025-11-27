import { Accordion } from "@/components/ui/accordion";
import StatusPanel from "../components/StatusPanel";
import HistoryPanel from "./components/HistoryPanel";
import PlanPanel from "./components/PlanPanel";
import ReportPanel from "./components/ReportPanel";

interface GeneralAgentSidebarProps {
  agentType: string;
  agentName: string;
  description: string;
}

export default function GeneralAgentSidebar({
  agentType,
  agentName,
  description,
}: GeneralAgentSidebarProps) {
  console.log("agentType,", agentType);

  return (
    <div className="w-115 space-y-4 overflow-y-auto p-4 bg-muted/30 rounded-lg">
      <Accordion
        type="multiple"
        defaultValue={["status"]}
        className="space-y-2"
      >
        {/* 智能体状态面板 */}
        <StatusPanel agentName={agentName} description={description} />

        {/* 综合智能体的高级功能 */}
        <HistoryPanel />
        <PlanPanel />
        <ReportPanel />
      </Accordion>
    </div>
  );
}
