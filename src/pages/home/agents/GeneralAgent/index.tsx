import ChatArea from "../components/ChatArea";
import GeneralAgentSidebar from "./GeneralAgentSidebar";
import { AGENT_CONFIGS } from "@/lib/constance";

export default function GeneralAgent() {
  const config = AGENT_CONFIGS.general;

  return (
    <div className="flex h-full gap-4">
      {/* 左侧 Sidebar - 使用 GeneralAgent 专属的 Sidebar */}
      <GeneralAgentSidebar
        agentType={config.type}
        agentName={config.name}
        description={config.description}
      />

      {/* 右侧聊天区 */}
      <div className="flex-1">
        <ChatArea placeholder={config.placeholder} />
      </div>
    </div>
  );
}
