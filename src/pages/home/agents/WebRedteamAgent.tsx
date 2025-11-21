import AgentPageLayout from "./components/AgentPageLayout";

export default function WebRedteamAgent() {
  return (
    <AgentPageLayout
      config={{
        type: "web_redteam",
        name: "Web红队智能体",
        description:
          "Web红队智能体是集合多种工具的AI自动化渗透测试工具,集成了Web目录扫描、技术栈探测等核心功能。通过智能化的多线程扫描技术,可快速探测目标站点隐藏目录、暴露接口及未授权资源;基于预置的指纹库,自动识别常见web框架;其模块化设计支持自定义策略扩展,适用于红队实战、资产自查等场景。",
        placeholder:
          "请输入Web渗透指令,例如:请帮我扫描https://long-admin-98k.verycomplicated.zbtcsgo.com的web路径,发现可能的渗透点",
      }}
    />
  );
}
