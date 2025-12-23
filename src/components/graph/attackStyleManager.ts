import type { Graph as G6Graph } from "@antv/g6";
import { ATTACK_STATE_STYLES, RIPPLE_ANIMATION_FRAMES } from "./styleConfig";
import type { AttackStatus } from "./attackSSE";

// 涟漪动画配置
const RIPPLE_FRAME_DURATION = 150; // 每帧持续时间(ms)

/**
 * 攻击样式管理器
 * 负责管理节点的攻击状态样式变化和动画效果
 */
export class AttackStyleManager {
  private graph: G6Graph;
  private attackStatus: AttackStatus;

  // 涟漪动画状态
  private rippleAnimationId: number | null = null;
  private rippleFrameIndex = 0;
  private lastFrameTime = 0;
  private currentRippleNodeId: string | null = null;

  constructor(graph: G6Graph) {
    this.graph = graph;
    this.attackStatus = {
      compromosed_ips: [],
      current_attack_ip: "",
    };
  }

  /**
   * 根据 IP 查找节点 ID
   */
  findNodeIdByIp(targetIp: string): string | undefined {
    const allNodes = this.graph.getNodeData();
    for (const node of allNodes) {
      const nets = node.data?.nets as Array<{ address?: string }> | undefined;
      if (nets && Array.isArray(nets)) {
        for (const net of nets) {
          const ip = net.address?.split("/")[0];
          if (ip === targetIp) {
            return node.id as string;
          }
        }
      }
    }
    return undefined;
  }

  /**
   * 更新节点攻击状态样式
   */
  updateNodeAttackStyle(
    nodeId: string,
    state: "normal" | "attacking" | "compromised",
    forceRender = true
  ): void {
    const stateStyle = ATTACK_STATE_STYLES[state];
    if (!stateStyle) {
      console.warn(`未知的攻击状态: ${state}`);
      return;
    }

    try {
      this.graph.updateNodeData([{ id: nodeId, style: stateStyle }]);
      if (forceRender) {
        this.graph.draw();
      }
    } catch (error) {
      console.error(`更新节点 ${nodeId} 样式失败:`, error);
    }
  }

  /**
   * 处理攻击状态更新
   */
  handleAttackStatusUpdate(status: AttackStatus): void {
    console.log("AttackStyleManager - handleAttackStatusUpdate:", status);

    const prevStatus = this.attackStatus;

    // 1. 处理上一次正在攻击的节点
    if (prevStatus.current_attack_ip) {
      const prevNodeId = this.findNodeIdByIp(prevStatus.current_attack_ip);
      if (prevNodeId) {
        const isCompromised = status.compromosed_ips.includes(
          prevStatus.current_attack_ip
        );
        this.updateNodeAttackStyle(
          prevNodeId,
          isCompromised ? "compromised" : "normal",
          false
        );
      }
    }

    // 2. 处理已被攻破的节点
    status.compromosed_ips.forEach((ip) => {
      const nodeId = this.findNodeIdByIp(ip);
      if (nodeId) {
        this.updateNodeAttackStyle(nodeId, "compromised", false);
      }
    });

    // 3. 处理当前正在被攻击的节点
    if (status.current_attack_ip) {
      const attackingNodeId = this.findNodeIdByIp(status.current_attack_ip);
      if (attackingNodeId) {
        this.startRippleAnimation(attackingNodeId);
      }
    } else {
      this.stopRippleAnimation();
    }

    // 更新状态
    this.attackStatus = status;

    // 批量渲染
    this.graph.draw();
  }

  /**
   * 启动涟漪动画 - 使用 requestAnimationFrame 实现流畅效果
   */
  startRippleAnimation(nodeId: string): void {
    this.stopRippleAnimation(); // 先停止之前的动画

    this.rippleFrameIndex = 0;
    this.lastFrameTime = 0;
    this.currentRippleNodeId = nodeId;

    const animate = (currentTime: number) => {
      // 初始化时间
      if (this.lastFrameTime === 0) {
        this.lastFrameTime = currentTime;
      }

      // 计算时间差
      const elapsed = currentTime - this.lastFrameTime;

      // 达到帧间隔时切换下一帧
      if (elapsed >= RIPPLE_FRAME_DURATION) {
        const frameStyle = RIPPLE_ANIMATION_FRAMES[this.rippleFrameIndex];

        try {
          this.graph.updateNodeData([{ id: nodeId, style: frameStyle }]);
          this.graph.draw();
        } catch (error) {
          console.error("涟漪动画更新失败:", error);
          return; // 出错时停止动画
        }

        // 循环播放动画帧
        this.rippleFrameIndex =
          (this.rippleFrameIndex + 1) % RIPPLE_ANIMATION_FRAMES.length;
        this.lastFrameTime = currentTime;
      }

      // 继续下一帧
      this.rippleAnimationId = requestAnimationFrame(animate);
    };

    // 启动动画循环
    this.rippleAnimationId = requestAnimationFrame(animate);
  }

  /**
   * 停止涟漪动画
   */
  stopRippleAnimation(): void {
    if (this.rippleAnimationId !== null) {
      cancelAnimationFrame(this.rippleAnimationId);
      this.rippleAnimationId = null;
    }
    this.rippleFrameIndex = 0;
    this.lastFrameTime = 0;
    this.currentRippleNodeId = null;
  }

  /**
   * 重置所有节点状态为正常
   */
  resetAllNodes(): void {
    const allNodes = this.graph.getNodeData();
    allNodes.forEach((node) => {
      this.graph.updateNodeData([
        { id: node.id as string, style: ATTACK_STATE_STYLES.normal },
      ]);
    });
    this.attackStatus = {
      compromosed_ips: [],
      current_attack_ip: "",
    };
    this.graph.draw();
  }

  /**
   * 获取当前攻击状态
   */
  getAttackStatus(): AttackStatus {
    return this.attackStatus;
  }

  /**
   * 获取所有节点的 IP 列表
   */
  getAllNodeIps(): string[] {
    const allNodes = this.graph.getNodeData();
    const allIps: string[] = [];

    allNodes.forEach((node) => {
      const nets = node.data?.nets as Array<{ address?: string }> | undefined;
      if (nets && Array.isArray(nets)) {
        nets.forEach((net) => {
          const ip = net.address?.split("/")[0];
          if (ip) allIps.push(ip);
        });
      }
    });

    return allIps;
  }

  /**
   * 销毁管理器，清理资源
   */
  destroy(): void {
    this.stopRippleAnimation();
  }
}

/**
 * 创建攻击样式管理器实例
 */
export function createAttackStyleManager(graph: G6Graph): AttackStyleManager {
  return new AttackStyleManager(graph);
}
