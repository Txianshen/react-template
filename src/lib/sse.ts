import { FetchSSE } from "./sse-fetch";

/**
 * SSE 响应数据类型
 */
export interface SSEResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

/**
 * SSE 消息回调类型
 */
export type OnMessageCallback<T = any> = (data: T) => void;
export type OnStatusChangeCallback = (connected: boolean) => void;
export type OnErrorCallback = (error: any) => void;

/**
 * 创建计划 SSE 实例（统一使用Fetch SSE）
 */
export function createPlanSSE(url?: string): FetchSSE<string> {
  const sseUrl = url || `/getCurrentPlan`;
  
  // 获取token并添加到headers
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return new FetchSSE<string>(sseUrl, headers, true);
}

/**
 * SSE配置选项（简化版 - 统一使用Fetch SSE）
 */
export interface SSEOptions {
  /** 自定义headers */
  headers?: Record<string, string>;
  /** 会话ID */
  session_id?: string;
}

/**
 * 创建带认证的计划 SSE 实例（统一使用Fetch SSE，支持header和session_id）
 * 
 * @example
 * ```typescript
 * // 基础使用（token在header中）
 * const sse1 = createAuthPlanSSE();
 * 
 * // 添加自定义header
 * const sse2 = createAuthPlanSSE({ 
 *   headers: { "X-Custom": "value" }
 * });
 * 
 * // 传递session_id
 * const sse3 = createAuthPlanSSE({ 
 *   session_id: "your-session-id"
 * });
 * ```
 */
export function createAuthPlanSSE(options: SSEOptions = {}): FetchSSE<string> {
  const { headers = {}, session_id } = options;
  
  // 获取token
  const token = localStorage.getItem("token");
  const authHeaders: Record<string, string> = { ...headers };
  
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }
  
  // 构建URL，添加session_id参数
  let url = "/getCurrentPlan";
  if (session_id) {
    url += `?session_id=${session_id}`;
  }
  
  return new FetchSSE<string>(url, authHeaders, true);
}
