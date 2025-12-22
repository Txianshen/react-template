import { Graphin } from "@antv/graphin";
import { useRef } from "react";
import type { Graph as G6Graph } from "@antv/g6";
import { getPlaygroundInfo } from "@/api/cyber";

// 模块化导入
import { registerCustomNodes } from "./customNodes";
import { extractTopologyData } from "./dataParser";
import { applyTopologyStyles } from "./styleConfig";
import { createGraphOptions } from "./graphOptions";

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

  return (
    <div className="h-full w-full">
      <Graphin
        ref={graphRef}
        options={initialOptions}
        onInit={(graph) => {
          graphInstanceRef.current = graph;
          console.log("graph instance saved:", graph);

          // 实例初始化后，异步加载数据
          loadGraphData();
        }}
      />
    </div>
  );
}
