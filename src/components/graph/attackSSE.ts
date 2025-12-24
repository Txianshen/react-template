import { GenericSSE } from "@/lib/sse";

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
 * 创建攻击状态 SSE 实例
 */
export function createAttackSSE(url?: string): AttackSSE {
  const sseUrl = url || `/getPlaygroundStatus`;
  return new AttackSSE(sseUrl);
}

export type { AttackSSE, AttackStatus };
