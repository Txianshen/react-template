import AgentPageLayout from "./components/AgentPageLayout";

export default function ApitestAgent() {
  return (
    <AgentPageLayout
      config={{
        type: "apitest",
        name: "API测试智能体",
        description:
          "API安全测试专家专注于通过流量分析与自动化手段深度检测业务系统中的安全风险。能够模拟真实用户操作触发API调用,快速识别异常请求并精准定位潜在漏洞。借助请求重放与智能篡改技术,可高效验证越权、注入、敏感数据泄露等典型安全问题。所有测试均严格遵循授权范围与安全规范,确保过程可控、结果可复现。目标是在政击发生前,发现并修复API层面的安全隐患。",
        placeholder: "请输入API测试指令",
      }}
    />
  );
}
