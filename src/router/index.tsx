import type { RouteObject } from "react-router-dom";
import { Navigate, createHashRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthGuard from "../components/AuthGuard";
import PageLoader from "../components/PageLoader";

// 扩展路由对象类型，添加元数据
export type ExtendedRouteObject = RouteObject & {
  meta?: {
    title?: string;
    icon?: string;
    showInTabs?: boolean; // 是否在 Tabs 中显示
  };
  children?: ExtendedRouteObject[];
};

// 布局组件 - 立即加载
import Layout from "../layout/Layout";

// 页面组件 - 懒加载
const LoginPage = lazy(() => import("../pages/login"));
const SettingsPage = lazy(() => import("../pages/home/SettingsPage"));
const BrowserAutomation = lazy(() => import("../pages/home/BrowserAutomation"));

// 智能体页面 - 懒加载
const GeneralAgent = lazy(() => import("../pages/home/agents/GeneralAgent"));
const ReconAgent = lazy(() => import("../pages/home/agents/ReconAgent"));
const PortScanAgent = lazy(() => import("../pages/home/agents/PortScanAgent"));
const WebRedteamAgent = lazy(
  () => import("../pages/home/agents/WebRedteamAgent")
);
const ApitestAgent = lazy(() => import("../pages/home/agents/ApitestAgent"));
const VulscanAgent = lazy(() => import("../pages/home/agents/VulscanAgent"));
const VulexpAgent = lazy(() => import("../pages/home/agents/VulexpAgent"));
const CodeAuditAgent = lazy(
  () => import("../pages/home/agents/CodeAuditAgent")
);
const PostPentestAgent = lazy(
  () => import("../pages/home/agents/PostPentestAgent")
);

// 路由配置
const routesConfig: ExtendedRouteObject[] = [
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
        <Suspense fallback={<PageLoader />}>
          <Layout />
        </Suspense>
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
        meta: { title: "智能体设置", icon: "⚙️", showInTabs: true },
      },
      {
        path: "browser",
        element: <BrowserAutomation />,
        meta: { title: "浏览器自动化", icon: "⚙️", showInTabs: true },
      },
      {
        path: "agents",
        children: [
          {
            path: "general",
            element: <GeneralAgent />,
            meta: { title: "综合渗透智能体", icon: "🤖", showInTabs: true },
          },
          {
            path: "recon",
            element: <ReconAgent />,
            meta: { title: "信息搜集智能体", icon: "✉️", showInTabs: true },
          },
          {
            path: "port-scan",
            element: <PortScanAgent />,
            meta: { title: "端口探测智能体", icon: "💻", showInTabs: true },
          },
          {
            path: "web-redteam",
            element: <WebRedteamAgent />,
            meta: { title: "Web红队智能体", icon: "🌐", showInTabs: true },
          },
          {
            path: "apitest",
            element: <ApitestAgent />,
            meta: { title: "API测试智能体", icon: "☁️", showInTabs: true },
          },
          {
            path: "vulscan",
            element: <VulscanAgent />,
            meta: { title: "漏洞扫描智能体", icon: "🎯", showInTabs: true },
          },
          {
            path: "vulexp",
            element: <VulexpAgent />,
            meta: { title: "漏洞利用智能体", icon: "😈", showInTabs: true },
          },
          {
            path: "code-audit",
            element: <CodeAuditAgent />,
            meta: { title: "代码审计智能体", icon: "📃", showInTabs: true },
          },
          {
            path: "post-pentest",
            element: <PostPentestAgent />,
            meta: { title: "后渗透智能体", icon: "🕸️", showInTabs: true },
          },
        ],
      },
    ],
  },
];

// 从路由配置中提取 Tab 导航数据的工具函数
function extractTabsFromRoutes(
  routes: ExtendedRouteObject[],
  parentPath = ""
): Array<{ title: string; icon: string; path: string }> {
  const tabs: Array<{ title: string; icon: string; path: string }> = [];

  routes.forEach((route) => {
    const fullPath = route.path
      ? `${parentPath}/${route.path}`.replace(/\/+/g, "/")
      : parentPath;

    // 如果有 meta 且 showInTabs 为 true，则添加到 tabs
    if (route.meta?.showInTabs && route.meta.title && route.meta.icon) {
      tabs.push({
        title: route.meta.title,
        icon: route.meta.icon,
        path: fullPath,
      });
    }

    // 递归处理子路由
    if (route.children) {
      tabs.push(...extractTabsFromRoutes(route.children, fullPath));
    }
  });

  return tabs;
}

// 导出 Tabs 配置（自动从路由配置生成）
export const tabsConfig = extractTabsFromRoutes(routesConfig);

// 创建 Hash Router
export const router = createHashRouter(routesConfig);
