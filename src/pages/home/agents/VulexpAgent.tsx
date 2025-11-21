import AgentPageLayout from "./components/AgentPageLayout";

export default function VulexpAgent() {
  return (
    <AgentPageLayout
      config={{
        type: "vulexp",
        name: "漏洞利用智能体",
        description:
          "漏洞利用智能体是一个高度智能化的自动化攻击引擎。它利用AI分析目标系统的薄弱环节,并模拟黑客的逻辑链条进行决策。它能自主调用与编排渗透工具,精准发起漏洞验证和政击模拟。它在对抗环境中具备动态感知能力,可以灵活地实时切换政击模式、规避检测,并在整个过程中守护自身安全,最终形成闭环的政击能力测试与安全态势反馈。",
        placeholder: "请输入漏洞利用指令,例如:请对目标xxx.xxx利用CVE-xxxx-xxxx",
      }}
    />
  );
}
