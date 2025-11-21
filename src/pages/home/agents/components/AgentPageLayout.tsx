import AgentSidebar from "./AgentSidebar";
import ChatArea from "./ChatArea";
import { type AgentType } from "@/store/agentStore";

/**
 * 智能体配置接口
 */
interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  placeholder: string;
  showAdvancedFeatures?: boolean;
}

/**
 * 智能体页面布局组件
 */
interface AgentPageLayoutProps {
  config: AgentConfig;
  className?: string;
}

export default function AgentPageLayout({
  config,
  className = "flex h-full gap-4",
}: AgentPageLayoutProps) {
  return (
    <div className={className}>
      {/* 左侧 Sidebar */}
      <AgentSidebar
        agentType={config.type}
        agentName={config.name}
        description={config.description}
        showAdvancedFeatures={config.showAdvancedFeatures ?? false}
      />

      {/* 右侧聊天区 */}
      <div className="flex-1">
        <ChatArea placeholder={config.placeholder} />
      </div>
    </div>
  );
}
