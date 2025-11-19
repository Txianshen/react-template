import type { RouteObject } from "react-router-dom";
import { Navigate, createHashRouter } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";

// 布局组件
import Layout from "../layout/Layout";

// 页面组件
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import SettingsPage from "../pages/SettingsPage";
import BrowserAutomation from "../pages/BrowserAutomation";

// 智能体页面
import GeneralAgent from "../pages/agents/GeneralAgent";
import ReconAgent from "../pages/agents/ReconAgent";
import PortScanAgent from "../pages/agents/PortScanAgent";
import WebRedteamAgent from "../pages/agents/WebRedteamAgent";
import ApitestAgent from "../pages/agents/ApitestAgent";
import VulscanAgent from "../pages/agents/VulscanAgent";
import VulexpAgent from "../pages/agents/VulexpAgent";
import CodeAuditAgent from "../pages/agents/CodeAuditAgent";
import PostPentestAgent from "../pages/agents/PostPentestAgent";

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
        element: <Dashboard />,
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
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "browser",
        element: <BrowserAutomation />,
      },
    ],
  },
];

// 创建 Hash Router
export const router = createHashRouter(routesConfig);
