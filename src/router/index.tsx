import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate, createHashRouter } from "react-router-dom";
import AuthGuard from "@/guards/auth-guard";

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
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    ),
  },
  // 靶场页面
  {
    path: "/cyber",
    element: (
      <AuthGuard>
        <Suspense fallback={null}>
          <CyberPage />
        </Suspense>
      </AuthGuard>
    ),
  },
];

// 创建 Hash Router
export const router = createHashRouter(routesConfig);
