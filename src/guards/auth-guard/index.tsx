// import { Navigate } from 'react-router-dom'
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  // 检查localStorage中的token
  const isAuthenticated = localStorage.getItem("token");

  // 如果没有token，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 如果有token，渲染子组件
  return <>{children}</>;
}
