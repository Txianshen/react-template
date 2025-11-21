import AgentSidebar from "./components/AgentSidebar";
import ChatArea from "./components/ChatArea";

export default function CodeAuditAgent() {
  const agentConfig = {
    type: "code_audit",
    name: "代码审计智能体",
    description:
      "代码审计智能体负责自动化代码安全分析，专为渗透测试设计。其通过静态代码扫描与语义理解技术，精准识别SQL注入、反序列化、逻辑漏洞等高危风险，覆盖Java、Python、PHP等主流语言；结合漏洞模式库与上下文关联分析，可定位隐蔽缺陷并生成修复方案，同时降低误报率。支持与开发流程集成，助力红队快速聚焦核心漏洞，提升审计效率与代码安全性。",
    placeholder:
      "请输入代码审计指令，例如：请帮我指出下面代码有什么安全问题？<代码>",
  };

  return (
    <div className="flex h-full gap-4 p-4">
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
