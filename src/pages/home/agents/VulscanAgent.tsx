import AgentPageLayout from "./components/AgentPageLayout";

export default function VulscanAgent() {
  return (
    <AgentPageLayout
      config={{
        type: "vulscan",
        name: "漏洞扫描智能体",
        description:
          "漏洞扫描智能体是融合了人工智能的新一代自动化安全核心引擎。它突破传统扫描工具的限制,通过自适应的探测策略与实时威胁情报协同,能够主动、精准地狩猎系统中的安全弱点。该智能体大幅提升了漏洞检出效率与精准度,并能根据业务环境动态调整扫描强度,成为智能安全运维不可或缺的核心防线。",
        placeholder:
          "请输入Web漏洞扫描指令,例如:请对120.78.172.48目标进行poc扫描",
      }}
    />
  );
}
