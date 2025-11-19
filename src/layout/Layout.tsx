import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabsConfig } from "@/router";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 根据当前路由路径确定激活的 tab
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabsConfig.find((tab) => tab.path === currentPath);
    return activeTab ? activeTab.path : "/app/settings"; // 默认值
  };

  const handleTabChange = (value: string) => {
    navigate(value);
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
          {import.meta.env.VITE_APP_NAME} {import.meta.env.VITE_APP_VERSION}
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
          {tabsConfig.map((tab) => (
            <TabsTrigger key={tab.path} value={tab.path}>
              {tab.icon} {tab.title}
            </TabsTrigger>
          ))}
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
