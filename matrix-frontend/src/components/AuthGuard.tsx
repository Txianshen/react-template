// import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  // 后续增加登录token校验逻辑
  
  return <>{children}</>
}
