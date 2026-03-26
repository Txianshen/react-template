import type { RouteObject } from "react-router-dom";
import { createHashRouter } from "react-router-dom";
import HomeIndex from "@/pages/home/index";

// 路由配置
const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <HomeIndex />,
  },
];

// 创建 Hash Router
export const router = createHashRouter(routesConfig);
