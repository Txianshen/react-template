import type { RouteObject } from "react-router-dom";
import { Navigate, createHashRouter } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";

// 布局组件
import Layout from "../layout/Layout";

// 页面组件
import LoginPage from "../pages/login";
import SettingsPage from "../pages/home/components/SettingsPage";
import BrowserAutomation from "../pages/home/components/BrowserAutomation";

// 智能体页面
import GeneralAgent from "../pages/home/components/agents/GeneralAgent";
import ReconAgent from "../pages/home/components/agents/ReconAgent";
import PortScanAgent from "../pages/home/components/agents/PortScanAgent";
import WebRedteamAgent from "../pages/home/components/agents/WebRedteamAgent";
import ApitestAgent from "../pages/home/components/agents/ApitestAgent";
import VulscanAgent from "../pages/home/components/agents/VulscanAgent";
import VulexpAgent from "../pages/home/components/agents/VulexpAgent";
import CodeAuditAgent from "../pages/home/components/agents/CodeAuditAgent";
import PostPentestAgent from "../pages/home/components/agents/PostPentestAgent";

// 路由配置
const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/settings" replace />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "browser",
        element: <BrowserAutomation />,
      },
      {
        path: "agents",
        children: [
          {
            path: "general",
            element: <GeneralAgent />,
          },
          {
            path: "recon",
            element: <ReconAgent />,
          },
          {
            path: "port-scan",
            element: <PortScanAgent />,
          },
          {
            path: "web-redteam",
            element: <WebRedteamAgent />,
          },
          {
            path: "apitest",
            element: <ApitestAgent />,
          },
          {
            path: "vulscan",
            element: <VulscanAgent />,
          },
          {
            path: "vulexp",
            element: <VulexpAgent />,
          },
          {
            path: "code-audit",
            element: <CodeAuditAgent />,
          },
          {
            path: "post-pentest",
            element: <PostPentestAgent />,
          },
        ],
      },
    ],
  },
];

// 创建 Hash Router
export const router = createHashRouter(routesConfig);
