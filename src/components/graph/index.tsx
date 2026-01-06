import { Graphin } from "@antv/graphin";
import { useRef, useEffect, useCallback } from "react";
import type { Graph as G6Graph } from "@antv/g6";
import { getPlaygroundInfo } from "@/api/cyber";

// 模块化导入
import { registerCustomNodes } from "./customNodes";
import { extractTopologyData } from "./dataParser";
import { applyTopologyStyles, ATTACK_STATE_STYLES } from "./styleConfig";
import { createGraphOptions } from "./graphOptions";
import {
  createAttackSSE,
  type AttackSSE,
  type AttackStatus,
} from "./attackSSE";
import {
  createAttackStyleManager,
  type AttackStyleManager,
} from "./attackStyleManager";

// 注册自定义节点（只需执行一次）
registerCustomNodes();

// 初始空配置（无数据）
const initialOptions = createGraphOptions([], []);

/**
 * 获取容器数据
 */
const fetchContainerData = async (): Promise<any[]> => {
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

export default function Graph() {
  const graphRef = useRef();
  const graphInstanceRef = useRef<G6Graph | null>(null);
  const sseRef = useRef<AttackSSE | null>(null);
  const styleManagerRef = useRef<AttackStyleManager | null>(null);

  /**
   * 异步加载数据并更新图
   */
  const loadGraphData = useCallback(async () => {
    const graph = graphInstanceRef.current;
    if (!graph) return;

    const rawData = await fetchContainerData();
    const { nodes, edges } = processGraphData(rawData);
    graph.setData({ nodes, edges });
    await graph.render();

    console.log("图数据加载完成");
  }, []);

  /**
   * 初始化 SSE 连接
   */
  const initSSE = useCallback(() => {
    const manager = styleManagerRef.current;
    if (!manager) return;

    // 使用支持请求头的SSE，将token放在header中
    const sse = createAttackSSE({ useFetchSSE: true });

    sse.onMessage((data) => {
      console.log("收到攻击状态:", data);
      manager.handleAttackStatusUpdate(data);
    });

    sse.onStatusChange((connected) => {
      console.log("SSE 连接状态:", connected ? "已连接" : "已断开");
    });

    sse.connect();
    sseRef.current = sse;
  }, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      sseRef.current?.disconnect();
      styleManagerRef.current?.destroy();
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

          // 创建攻击样式管理器
          styleManagerRef.current = createAttackStyleManager(graph);

          // 加载数据后初始化 SSE
          loadGraphData().then(() => {
            initSSE();
          });
        }}
      />
    </div>
  );
}
