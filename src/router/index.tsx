import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate, createHashRouter } from "react-router-dom";
import AuthGuard from "@/guards/auth-guard";
import PageLoader from "@/components/page-loader";

const CyberPage = lazy(() => import("../pages/cyber"));
const LoginPage = lazy(() => import("../pages/login"));

// 扩展路由对象类型，添加元数据
export type ExtendedRouteObject = RouteObject & {
  meta?: {
    title?: string;
    icon?: string;
    showInTabs?: boolean; // 是否在 Tabs 中显示
  };
  children?: ExtendedRouteObject[];
};

// 路由配置
const routesConfig: ExtendedRouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  // 登录页面
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  // 靶场页面
  {
    path: "/cyber",
    element: (
      <AuthGuard>
        <Suspense fallback={<PageLoader />}>
          <CyberPage />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: "/cyber/:sessionId",
    element: (
      <AuthGuard>
        <Suspense fallback={<PageLoader />}>
          <CyberPage />
        </Suspense>
      </AuthGuard>
    ),
  },
];

// 创建 Hash Router
export const router = createHashRouter(routesConfig);
