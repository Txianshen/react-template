import { Accordion } from "@/components/ui/accordion";
import StatusPanel from "./StatusPanel";
import HistoryPanel from "./HistoryPanel";
import PlanPanel from "./PlanPanel";
import ReportPanel from "./ReportPanel";

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

  return (
    <div className="w-80 space-y-4 overflow-y-auto p-4 bg-muted/30 rounded-lg">
      <Accordion
        type="multiple"
        defaultValue={["status"]}
        className="space-y-2"
      >
        {/* 智能体状态面板 */}
        <StatusPanel agentName={agentName} description={description} />

        {/* 综合智能体的高级功能 */}
        {showAdvancedFeatures && (
          <>
            <HistoryPanel />
            <PlanPanel />
            <ReportPanel />
          </>
        )}
      </Accordion>
    </div>
  );
}
