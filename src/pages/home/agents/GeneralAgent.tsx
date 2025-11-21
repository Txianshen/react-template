import AgentSidebar from "./components/AgentSidebar";
import ChatArea from "./components/ChatArea";

export default function GeneralAgent() {
  const agentConfig = {
    type: "general",
    name: "综合渗透智能体",
    description:
      "综合渗透智能体是基于多智能体协作的自动化攻击框架，深度整合信息搜集，端口探测、漏洞扫描、漏洞利用等模块，支持从信息收集到漏洞利用的全流程渗透，具备智能决策能力和深度关联分析，可生成带攻击链可视化的渗透报告，适用于红蓝对抗演练、漏洞验证等场景，需严格遵守渗透政击授权范围。",
    placeholder: "请输入渗透目标，例如：目标是aifeex.com",
  };

  return (
    <div className="flex h-full gap-4 p-4">
      {/* 左侧 Sidebar */}
      <AgentSidebar
        agentType={agentConfig.type}
        agentName={agentConfig.name}
        description={agentConfig.description}
        showAdvancedFeatures={true}
      />

      {/* 右侧聊天区 */}
      <div className="flex-1">
        <ChatArea placeholder={agentConfig.placeholder} />
      </div>
    </div>
  );
}
