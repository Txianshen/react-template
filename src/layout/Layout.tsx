import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 根据当前路由路径确定激活的 tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/app" || path === "/app/settings") return "settings";
    if (path.includes("/app/browser")) return "browser";
    if (path.includes("/app/agents/general")) return "general";
    if (path.includes("/app/agents/recon")) return "recon";
    if (path.includes("/app/agents/port-scan")) return "port-scan";
    if (path.includes("/app/agents/web-redteam")) return "web-redteam";
    if (path.includes("/app/agents/apitest")) return "apitest";
    if (path.includes("/app/agents/vulscan")) return "vulscan";
    if (path.includes("/app/agents/vulexp")) return "vulexp";
    if (path.includes("/app/agents/code-audit")) return "code-audit";
    if (path.includes("/app/agents/post-pentest")) return "post-pentest";
    return "settings"; // 默认值
  };

  const handleTabChange = (value: string) => {
    const routes: Record<string, string> = {
      settings: "/app/settings",
      browser: "/app/browser",
      general: "/app/agents/general",
      recon: "/app/agents/recon",
      "port-scan": "/app/agents/port-scan",
      "web-redteam": "/app/agents/web-redteam",
      apitest: "/app/agents/apitest",
      vulscan: "/app/agents/vulscan",
      vulexp: "/app/agents/vulexp",
      "code-audit": "/app/agents/code-audit",
      "post-pentest": "/app/agents/post-pentest",
    };
    navigate(routes[value]);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* 标题区域 */}
      <div
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-4 text-center shadow-[0_12px_24px_rgba(0,0,0,0.3),0_0_0_1px_rgba(91,192,222,0.4)_inset]"
        style={{
          margin: "0rem 0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* 顶部高光条 */}
        <div
          className="absolute left-0 right-0 top-0 h-[2px] animate-[highlight_12s_linear_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #480ca8, #560bad, #3f37c9, #4361ee, #4895ef, transparent)",
          }}
        />

        {/* 主标题 */}
        <h1
          className="m-0 bg-gradient-to-r from-[#4a7cac] via-[#3a9696] to-[#2e6c9f] bg-clip-text p-0 text-4xl font-black leading-none tracking-[2px] text-transparent"
          style={{
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          Matrix 智攻矩阵 - AI智能攻防平台 V4.9
        </h1>

        {/* 底部高光条 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] animate-[highlight_12s_linear_infinite_reverse]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #480ca8, #560bad, #3f37c9, #4361ee, #4895ef, transparent)",
          }}
        />
      </div>

      {/* Tabs 导航 */}
      <Tabs
        value={getActiveTab()}
        onValueChange={handleTabChange}
        className="mt-4"
      >
        <TabsList className="grid w-full grid-cols-11 bg-[#27272a]">
          <TabsTrigger value="settings">⚙️ 智能体设置</TabsTrigger>
          <TabsTrigger value="browser">🖥️ 浏览器自动化</TabsTrigger>
          <TabsTrigger value="general">🤖 综合渗透智能体</TabsTrigger>
          <TabsTrigger value="recon">✉️ 信息搜集智能体</TabsTrigger>
          <TabsTrigger value="port-scan">💻 端口探测智能体</TabsTrigger>
          <TabsTrigger value="web-redteam">🌐 Web红队智能体</TabsTrigger>
          <TabsTrigger value="apitest">☁️ API测试智能体</TabsTrigger>
          <TabsTrigger value="vulscan">🎯 漏洞扫描智能体</TabsTrigger>
          <TabsTrigger value="vulexp">😈 漏洞利用智能体</TabsTrigger>
          <TabsTrigger value="code-audit">📃 代码审计智能体</TabsTrigger>
          <TabsTrigger value="post-pentest">🕸️ 后渗透智能体</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 内容区域 */}
      <main className="p-6">
        <Outlet />
      </main>

      {/* CSS 动画定义 */}
      <style>{`
        @keyframes highlight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
