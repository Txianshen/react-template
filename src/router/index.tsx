import type { RouteObject } from "react-router-dom";
import { Navigate, createHashRouter } from "react-router-dom";

import CyberPage from "../pages/cyber";

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
    element: <Navigate to="/cyber" replace />,
  },
  // 靶场页面
  {
    path: "/cyber",
    element: <CyberPage />,
  },
];

// 创建 Hash Router
export const router = createHashRouter(routesConfig);
