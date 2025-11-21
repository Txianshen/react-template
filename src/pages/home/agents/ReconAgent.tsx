import AgentSidebar from "./components/AgentSidebar";
import ChatArea from "./components/ChatArea";

export default function ReconAgent() {
  const agentConfig = {
    type: "recon",
    name: "信息搜集智能体",
    description:
      "信息搜集智能体是多引擎的自动化信息搜集工具，支持主动扫描和被动检索，可快速发现目标域名的隐藏资产，内置智能去重和结果分类功能，支持自定义字典深度爆破，适用于企业资产梳理、渗透测试信息收集等场景，需注意遵守网络安全法规禁止未授权扫描。",
    placeholder:
      "请输入信息搜集指令，例如：请帮我找出jumpvip.vip的所有子域名以及IP信息",
  };

  return (
    <div className="flex h-full gap-4 p-4">
      {/* 左侧 Sidebar */}
      <AgentSidebar
        agentType={agentConfig.type}
        agentName={agentConfig.name}
        description={agentConfig.description}
        showAdvancedFeatures={false}
      />

      {/* 右侧聊天区 */}
      <div className="flex-1">
        <ChatArea placeholder={agentConfig.placeholder} />
      </div>
    </div>
  );
}
