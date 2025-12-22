/**
 * 原始节点数据类型
 */
export interface RawNode {
  id: string;
  label: string;
  role: string;
  meta: Record<string, any>;
  isNetwork: boolean;
}

/**
 * 原始边数据类型
 */
export interface RawEdge {
  source: string;
  target: string;
  label: string; // 边的标签（如IP地址）
}

/**
 * 解析后的原始拓扑数据
 */
export interface RawTopology {
  nodes: RawNode[];
  edges: RawEdge[];
}

/**
 * 从 SeedEmu 容器数据中提取原始节点和边
 * 只负责数据提取，不处理样式
 */
export function extractTopologyData(jsonArray: any[]): RawTopology {
  const nodesMap = new Map<string, RawNode>();
  const edges: RawEdge[] = [];

  const addNode = (
    id: string,
    label: string,
    role: string,
    meta: Record<string, any> = {},
    isNetwork: boolean = false
  ) => {
    if (!nodesMap.has(id)) {
      nodesMap.set(id, {
        id,
        label,
        role,
        meta,
        isNetwork,
      });
    }
  };

  jsonArray.forEach((container) => {
    if (!container.meta || !container.meta.emulatorInfo) return;

    const info = container.meta.emulatorInfo;
    const asn = info.asn;
    const containerId = container.Id;

    // 添加主节点
    const nodeLabel = `${asn}/${info.name}`;
    addNode(containerId, nodeLabel, info.role, info, false);

    // 处理网络连接
    if (info.nets && Array.isArray(info.nets)) {
      info.nets.forEach((net: any) => {
        const netName = net.name;
        const isIX = netName.startsWith("ix");

        // 生成网络节点ID
        const networkNodeId = isIX
          ? `global_${netName}`
          : `as${asn}_${netName}`;

        // 生成网络节点标签
        const networkLabel = isIX ? netName : `${asn}/${netName}`;

        // 添加网络节点
        addNode(
          networkNodeId,
          networkLabel,
          "Network",
          { type: "network", name: netName },
          true
        );

        // 添加边
        edges.push({
          source: containerId,
          target: networkNodeId,
          label: net.address,
        });
      });
    }
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}
