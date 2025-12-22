import { Graphin } from "@antv/graphin";
import { useRef, useMemo } from "react";
import { container } from "@/lib/container";

// 模块化导入
import { registerCustomNodes } from "./customNodes";
import { extractTopologyData } from "./dataParser";
import { applyTopologyStyles } from "./styleConfig";
import { createGraphOptions } from "./graphOptions";

// 注册自定义节点（只需执行一次）
registerCustomNodes();

export default function Graph() {
  const graphRef = useRef();

  // 使用 useMemo 缓存数据处理结果，避免重复计算
  const options = useMemo(() => {
    // 1. 数据解析：提取原始节点和边
    const { nodes: rawNodes, edges: rawEdges } = extractTopologyData(container);

    // 2. 样式应用：为节点和边添加样式
    const { nodes, edges } = applyTopologyStyles(rawNodes, rawEdges);

    console.log("SEEDEMU数据处理后获得的节点和边:", { nodes, edges });

    // 3. 创建 Graphin 配置
    return createGraphOptions(nodes, edges);
  }, []);

  return (
    <div className="h-full w-full">
      <Graphin ref={graphRef} options={options} />
    </div>
  );
}
