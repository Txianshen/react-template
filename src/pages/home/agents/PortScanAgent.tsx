import AgentSidebar from "./components/AgentSidebar";
import ChatArea from "./components/ChatArea";

export default function PortScanAgent() {
  const agentConfig = {
    type: "port_scan" as const,
    name: "端口探测智能体",
    description:
      "端口探测智能体是集成多种扫描工具的专业的网络端口探测，支持TCP/UDP协议的多模式探测，可执行快速扫描、深度全端口扫描和隐蔽式SYN扫描。支持批量扫描IP段，集成服务指纹识别和安全风险分析。适用于网络运维排障、服务器安全审计、物联网设备管理等场景，使用时需遵守网络安全法规。",
    placeholder:
      "请输入端口探测指令，例如：请帮我扫描IP地块40.255.223.178的全部端口",
  };

  return (
    <div className="flex h-full gap-4 ">
      <AgentSidebar
        agentType={agentConfig.type}
        agentName={agentConfig.name}
        description={agentConfig.description}
        showAdvancedFeatures={false}
      />
      <div className="flex-1">
        <ChatArea placeholder={agentConfig.placeholder} />
      </div>
    </div>
  );
}
