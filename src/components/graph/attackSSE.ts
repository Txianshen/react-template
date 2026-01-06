import { FetchSSE } from '@/lib/fetch-sse'
import type { SSEOptions } from "@/lib/auth-plan-sse";

/**
 * 攻击状态数据类型
 */
export interface AttackStatus {
  compromosed_ips: string[]; // 已被攻破的IP列表
  current_attack_ip: string; // 当前正在被攻击的IP
}


/**
 * 创建攻击状态 SSE 实例（统一使用Fetch SSE，支持header和session_id）
 * 
 * @example
 * ```typescript
 * // 基础使用（token在header中）
 * const sse1 = createAttackSSE();
 * 
 * // 添加自定义header
 * const sse2 = createAttackSSE({ 
 *   headers: { "X-Custom": "value" }
 * });
 * 
 * // 传递session_id
 * const sse3 = createAttackSSE({ 
 *   session_id: "your-session-id"
 * });
 * ```
 */
export function createAttackSSE(options: SSEOptions = {}): FetchSSE<AttackStatus> {
  const { headers = {}, session_id } = options;
  
  // 获取token
  const token = localStorage.getItem("token");
  const authHeaders: Record<string, string> = { ...headers };
  
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }
  
  // 构建URL，添加session_id参数
  let url = "/getPlaygroundStatus";
  if (session_id) {
    url += `?session_id=${session_id}`;
  }
  
  return new FetchSSE<AttackStatus>(url, authHeaders, true);
}
