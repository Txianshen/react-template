import { Graphin } from "@antv/graphin";
import { useRef, useEffect, useCallback } from "react";
import type { Graph as G6Graph } from "@antv/g6";
import { getPlaygroundInfo } from "@/api/cyber";
import { container } from "@/lib/container"; // 测试用静态数据

// 模块化导入
import { registerCustomNodes } from "./customNodes";
import { extractTopologyData } from "./dataParser";
import {
  applyTopologyStyles,
  ATTACK_STATE_STYLES,
  RIPPLE_ANIMATION_FRAMES,
} from "./styleConfig";
import { createGraphOptions } from "./graphOptions";
import {
  createAttackSSE,
  type AttackSSE,
  type AttackStatus,
} from "./attackSSE";

// ============ 测试模式开关 ============
const TEST_MODE = false; // 设为 false 使用真实接口
// =====================================

// 注册自定义节点（只需执行一次）
registerCustomNodes();

// 初始空配置（无数据）
const initialOptions = createGraphOptions([], []);

/**
 * 获取容器数据
 */
const fetchContainerData = async (): Promise<any[]> => {
  if (TEST_MODE) {
    // 测试模式：使用静态数据
    return container;
  }
  const res = await getPlaygroundInfo();
  return res.data?.result || [];
};

/**
 * 处理原始数据并转换为图数据
 */
const processGraphData = (rawData: any[]) => {
  const { nodes: rawNodes, edges: rawEdges } = extractTopologyData(rawData);
  const { nodes, edges } = applyTopologyStyles(rawNodes, rawEdges);
  console.log("SEEDEMU数据处理后获得的节点和边:", { nodes, edges });
  return { nodes, edges };
};

/**
 * 根据IP查找节点ID
 * 节点的 nets 数据中包含该节点的IP地址
 */
const findNodeIdByIp = (
  graph: G6Graph,
  targetIp: string
): string | undefined => {
  const allNodes = graph.getNodeData();
  for (const node of allNodes) {
    const nets = node.data?.nets as Array<{ address?: string }> | undefined;
    if (nets && Array.isArray(nets)) {
      for (const net of nets) {
        // IP 地址可能带 CIDR，如 "10.0.0.1/24"，需要提取纯 IP
        const ip = net.address?.split("/")[0];
        if (ip === targetIp) {
          return node.id as string;
        }
      }
    }
  }
  return undefined;
};

// 涟漪动画状态
let rippleAnimationId: number | null = null;
let rippleFrameIndex = 0;
let lastFrameTime = 0;
const RIPPLE_FRAME_DURATION = 150; // 每帧持续时间(ms)

export default function Graph() {
  const graphRef = useRef();
  const graphInstanceRef = useRef<G6Graph | null>(null);
  const sseRef = useRef<AttackSSE | null>(null);
  // 保存当前攻击状态，用于跟踪哪些节点需要恢复
  const attackStatusRef = useRef<AttackStatus>({
    compromosed_ips: [],
    current_attack_ip: "",
  });

  /**
   * 更新节点攻击状态样式
   */
  const updateNodeAttackStyle = useCallback(
    (
      nodeId: string,
      state: "normal" | "attacking" | "compromised",
      forceRender = true
    ) => {
      const graph = graphInstanceRef.current;
      if (!graph) return;

      const stateStyle = ATTACK_STATE_STYLES[state];

      try {
        // 使用 updateNodeData 更新节点样式
        graph.updateNodeData([{ id: nodeId, style: stateStyle }]);

        if (forceRender) {
          graph.draw();
        }
      } catch (error) {
        console.error(`更新节点 ${nodeId} 样式失败:`, error);
      }
    },
    []
  );

  /**
   * 处理攻击状态更新
   */
  const handleAttackStatusUpdate = useCallback(
    (status: AttackStatus) => {
      console.log("handleAttackStatusUpdate:", status);
      const graph = graphInstanceRef.current;
      if (!graph) return;

      const prevStatus = attackStatusRef.current;

      // 1. 处理上一次正在攻击的节点（如果不再被攻击，恢复正常或设置为已攻破）
      if (prevStatus.current_attack_ip) {
        const prevNodeId = findNodeIdByIp(graph, prevStatus.current_attack_ip);
        if (prevNodeId) {
          // 检查是否已被攻破
          const isCompromised = status.compromosed_ips.includes(
            prevStatus.current_attack_ip
          );
          updateNodeAttackStyle(
            prevNodeId,
            isCompromised ? "compromised" : "normal",
            false
          );
        }
      }

      // 2. 处理已被攻破的节点
      status.compromosed_ips.forEach((ip) => {
        const nodeId = findNodeIdByIp(graph, ip);
        if (nodeId) {
          updateNodeAttackStyle(nodeId, "compromised", false);
        }
      });

      // 3. 处理当前正在被攻击的节点
      if (status.current_attack_ip) {
        const attackingNodeId = findNodeIdByIp(graph, status.current_attack_ip);
        if (attackingNodeId) {
          // 启动涟漪动画
          startRippleAnimation(attackingNodeId);
        }
      } else {
        // 停止涟漪动画
        stopRippleAnimation();
      }

      // 更新状态引用
      attackStatusRef.current = status;

      // 批量渲染
      graph.draw();
    },
    [updateNodeAttackStyle]
  );

  /**
   * 启动涟漪动画 - 使用 requestAnimationFrame 实现更流畅的效果
   */
  const startRippleAnimation = (nodeId: string) => {
    stopRippleAnimation(); // 先停止之前的动画

    const graph = graphInstanceRef.current;
    if (!graph) return;

    rippleFrameIndex = 0;
    lastFrameTime = 0;

    const animate = (currentTime: number) => {
      // 初始化时间
      if (lastFrameTime === 0) {
        lastFrameTime = currentTime;
      }

      // 计算时间差
      const elapsed = currentTime - lastFrameTime;

      // 达到帧间隔时切换下一帧
      if (elapsed >= RIPPLE_FRAME_DURATION) {
        const frameStyle = RIPPLE_ANIMATION_FRAMES[rippleFrameIndex];

        try {
          graph.updateNodeData([{ id: nodeId, style: frameStyle }]);
          graph.draw();
        } catch (error) {
          console.error("涟漪动画更新失败:", error);
          return; // 出错时停止动画
        }

        // 循环播放动画帧
        rippleFrameIndex =
          (rippleFrameIndex + 1) % RIPPLE_ANIMATION_FRAMES.length;
        lastFrameTime = currentTime;
      }

      // 继续下一帧
      rippleAnimationId = requestAnimationFrame(animate);
    };

    // 启动动画循环
    rippleAnimationId = requestAnimationFrame(animate);
  };

  /**
   * 停止涟漪动画
   */
  const stopRippleAnimation = () => {
    if (rippleAnimationId !== null) {
      cancelAnimationFrame(rippleAnimationId);
      rippleAnimationId = null;
    }
    rippleFrameIndex = 0;
    lastFrameTime = 0;
  };

  /**
   * 异步加载数据并更新图
   */
  const loadGraphData = async () => {
    const graph = graphInstanceRef.current;
    if (!graph) return;

    // 1. 异步获取数据
    const rawData = await fetchContainerData();

    // 2. 处理数据
    const { nodes, edges } = processGraphData(rawData);

    // 3. 通过实例 setData 设置数据
    graph.setData({ nodes, edges });

    // 4. 重新渲染
    await graph.render();

    console.log("图数据加载完成");
  };

  /**
   * 模拟 WS 测试数据（从 container 中提取真实 IP）
   */
  const startMockAttackSimulation = useCallback(() => {
    const graph = graphInstanceRef.current;
    if (!graph) return;

    // 从图中获取所有节点的 IP
    const allNodes = graph.getNodeData();
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

    if (allIps.length === 0) {
      console.warn("没有找到可用的 IP 地址进行模拟");
      return;
    }

    console.log("模拟攻击可用 IP 列表:", allIps);

    let compromisedIps: string[] = [];
    let currentIndex = 0;

    // 每 3 秒模拟一次攻击状态更新
    const mockInterval = setInterval(() => {
      if (currentIndex >= allIps.length) {
        // 攻击完成，重置
        console.log("模拟攻击完成，重新开始...");
        compromisedIps = [];
        currentIndex = 0;

        // 重置所有节点状态
        allIps.forEach((ip) => {
          const nodeId = findNodeIdByIp(graph, ip);
          if (nodeId) {
            graph.updateNodeData([
              { id: nodeId, style: ATTACK_STATE_STYLES.normal },
            ]);
          }
        });
        graph.draw();
        return;
      }

      const currentAttackIp = allIps[currentIndex];

      // 模拟数据
      const mockStatus: AttackStatus = {
        compromosed_ips: [...compromisedIps],
        current_attack_ip: currentAttackIp,
      };

      console.log("模拟 WS 消息:", mockStatus);
      handleAttackStatusUpdate(mockStatus);

      // 2 秒后，当前节点被攻破
      setTimeout(() => {
        compromisedIps.push(currentAttackIp);
        currentIndex++;

        // 发送攻破状态（无当前攻击）
        const afterStatus: AttackStatus = {
          compromosed_ips: [...compromisedIps],
          current_attack_ip:
            currentIndex < allIps.length ? allIps[currentIndex] : "",
        };
        handleAttackStatusUpdate(afterStatus);
      }, 2000);
    }, 4000); // 每 4 秒攻击一个新节点

    // 保存定时器以便清理
    return () => clearInterval(mockInterval);
  }, [handleAttackStatusUpdate]);

  /**
   * 初始化 SSE 连接
   */
  const initSSE = useCallback(() => {
    if (TEST_MODE) {
      // 测试模式：使用模拟数据
      console.log("测试模式：启动模拟攻击动画");
      startMockAttackSimulation();
      return;
    }

    // 真实模式：连接 SSE
    const sse = createAttackSSE();

    sse.onMessage((data) => {
      console.log("收到攻击状态:", data);
      handleAttackStatusUpdate(data);
    });

    sse.onStatusChange((connected) => {
      console.log("SSE 连接状态:", connected ? "已连接" : "已断开");
    });

    sse.connect();
    sseRef.current = sse;
  }, [handleAttackStatusUpdate, startMockAttackSimulation]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      // 断开 SSE
      sseRef.current?.disconnect();
      // 停止涟漪动画
      stopRippleAnimation();
    };
  }, []);

  return (
    <div className="h-full w-full">
      <Graphin
        ref={graphRef}
        options={initialOptions}
        onInit={(graph) => {
          graphInstanceRef.current = graph;
          console.log("graph instance saved:", graph);

          // 实例初始化后，异步加载数据
          loadGraphData().then(() => {
            // 数据加载完成后，初始化 SSE
            initSSE();
          });
        }}
      />
    </div>
  );
}
