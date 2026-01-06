import { GenericSSE } from "@/lib/sse";
import { FetchSSE } from '@/lib/sse-fetch'
import type { SSEOptions } from "@/lib/sse";

/**
 * 攻击状态数据类型
 */
export interface AttackStatus {
  compromosed_ips: string[]; // 已被攻破的IP列表
  current_attack_ip: string; // 当前正在被攻击的IP
}

/**
 * 攻击状态 SSE 管理类 - 使用通用SSE实现
 */
class AttackSSE extends GenericSSE<AttackStatus> {
  constructor(url: string) {
    super(url);
  }
}

/**
 * 创建攻击状态 SSE 实例（支持header和session_id）
 * 
 * @example
 * ```typescript
 * // 使用原生EventSource（token在URL中）
 * const sse1 = createAttackSSE();
 * 
 * // 使用Fetch SSE（token在header中）
 * const sse2 = createAttackSSE({ useFetchSSE: true });
 * 
 * // 使用Fetch SSE并添加自定义header
 * const sse3 = createAttackSSE({ 
 *   useFetchSSE: true,
 *   headers: { "X-Custom": "value" }
 * });
 * 
 * // 使用Fetch SSE并传递session_id
 * const sse4 = createAttackSSE({ 
 *   useFetchSSE: true,
 *   session_id: "your-session-id"
 * });
 * ```
 */
export function createAttackSSE(options: SSEOptions = {}): AttackSSE | FetchSSE<AttackStatus> {
  const { useFetchSSE = false, headers = {}, session_id } = options;
  
  // 获取token
  const token = localStorage.getItem("token");
  
  if (useFetchSSE) {
    // 使用Fetch SSE，支持自定义header
    const authHeaders: Record<string, string> = { ...headers };
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
    
    // 构建URL，添加session_id参数
    let url = "/getPlaygroundStatus";
    if (session_id) {
      url += `?session_id=${encodeURIComponent(session_id)}`;
    }
    
    return new FetchSSE<AttackStatus>(url, authHeaders, true);
  } else {
    // 使用原生EventSource，token在URL中
    let urlParams = new URLSearchParams();
    if (token) {
      urlParams.append('token', token);
    }
    if (session_id) {
      urlParams.append('session_id', session_id);
    }
    
    const queryString = urlParams.toString();
    const sseUrl = `/getPlaygroundStatus${queryString ? '?' + queryString : ''}`;
    return new AttackSSE(sseUrl);
  }
}

export type { AttackSSE, AttackStatus };
