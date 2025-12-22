import routerSVG from "@/assets/icons/cyber/router.svg";
import bgpSvg from "@/assets/icons/cyber/bgp.svg";
import hostSvg from "@/assets/icons/cyber/host.svg";
import networkSvg from "@/assets/icons/cyber/network.svg";
import type { RawNode, RawEdge } from "./dataParser";

/**
 * 攻击状态类型
 */
export type AttackState = "normal" | "attacking" | "compromised";

/**
 * 节点角色样式配置
 */
interface NodeStyleConfig {
  color: string;
  size: number;
  badge: string;
  src: string;
}

/**
 * 节点角色到样式的映射配置
 */
const NODE_STYLE_CONFIG: Record<string, NodeStyleConfig> = {
  BorderRouter: {
    color: "#FF7675",
    size: 60,
    badge: "R",
    src: routerSVG,
  },
  Host: {
    color: "#FF7675",
    size: 60,
    badge: "H",
    src: hostSvg,
  },
  "Route Server": {
    color: "#FF7675",
    size: 60,
    badge: "S",
    src: hostSvg,
  },
  Network: {
    color: "#FF7675",
    size: 60,
    badge: "",
    src: networkSvg,
  },
  IX: {
    color: "#FF7675",
    size: 60,
    badge: "IX",
    src: bgpSvg,
  },
};

/**
 * 攻击状态样式配置
 */
export const ATTACK_STATE_STYLES = {
  // 已被攻破 - 深红色背景 + 骷髅图标效果
  compromised: {
    fill: "#c0392b",
    fillOpacity: 0.8,
    stroke: "#e74c3c",
    lineWidth: 3,
    halo: false,
    // 添加危险标志
    badgeText: "☠",
    badgeBackgroundFill: "#c0392b",
  },
  // 正常状态
  normal: {
    halo: false,
    fill: "orange",
    fillOpacity: 0.4,
  },
};

/**
 * 涟漪动画帧配置
 * 每一帧对应不同的涟漪扩散状态
 */
export const RIPPLE_ANIMATION_FRAMES = [
  // 第1层涟漪 - 最内层，最亮
  {
    halo: true,
    haloStroke: "#ff4757",
    haloStrokeWidth: 2,
    haloLineWidth: 8,
    haloStrokeOpacity: 0.9,
  },
  // 第2层涟漪
  {
    halo: true,
    haloStroke: "#ff4757",
    haloStrokeWidth: 2,
    haloLineWidth: 16,
    haloStrokeOpacity: 0.7,
  },
  // 第3层涟漪
  {
    halo: true,
    haloStroke: "#ff4757",
    haloStrokeWidth: 2,
    haloLineWidth: 24,
    haloStrokeOpacity: 0.5,
  },
  // 第4层涟漪
  {
    halo: true,
    haloStroke: "#ff4757",
    haloStrokeWidth: 2,
    haloLineWidth: 32,
    haloStrokeOpacity: 0.3,
  },
  // 第5层涟漪 - 最外层，最淡
  {
    halo: true,
    haloStroke: "#ff4757",
    haloStrokeWidth: 2,
    haloLineWidth: 40,
    haloStrokeOpacity: 0.1,
  },
];

/**
 * 获取攻击状态对应的节点样式补丁
 */
export function getAttackStateStyle(state: AttackState): Record<string, any> {
  return ATTACK_STATE_STYLES[state] || ATTACK_STATE_STYLES.normal;
}

/**
 * 获取节点的样式配置
 */
function getNodeStyleConfig(node: RawNode): NodeStyleConfig {
  if (node.isNetwork) {
    const isIX = node.label.startsWith("ix");
    return isIX ? NODE_STYLE_CONFIG.IX : NODE_STYLE_CONFIG.Network;
  }
  return NODE_STYLE_CONFIG[node.role] || NODE_STYLE_CONFIG.Host;
}

/**
 * 为原始节点应用样式，生成 G6 节点数据
 */
export function applyNodeStyles(rawNodes: RawNode[]): any[] {
  return rawNodes.map((node) => {
    const styleConfig = getNodeStyleConfig(node);

    return {
      id: node.id,
      type: "circle-image", // 自定义 circle-image 节点
      data: {
        ...node.meta,
        role: node.role,
        isNetwork: node.isNetwork,
      },
      style: {
        // 节点基础样式
        zIndex: 1,
        size: styleConfig.size,
        fill: "orange", // 选中光晕效果
        fillOpacity: 0.4,

        // 图片配置
        icon: styleConfig.src,
        iconSize: 60,

        // 标签样式
        labelText: node.label,
        labelPlacement: "bottom",
        labelFill: "#e6e6e6",
        labelFontSize: 12,
        labelOffsetY: 4,
        labelWordWrap: true,
        labelMaxWidth: 120,

        // 徽标样式
        badges: styleConfig.badge
          ? [
              {
                text: styleConfig.badge,
                placement: "right",
                backgroundFill: styleConfig.color,
                fill: "#fff",
                fontSize: 9,
                backgroundRadius: 10,
                backgroundStroke: "#fff",
                textAlign: "center",
                textBaseline: "middle",
                lineHeight: 15,
                offsetY: -18,
                offsetX: -6,
              },
            ]
          : [],
      },
    };
  });
}

/**
 * 为原始边应用样式，生成 G6 边数据
 */
export function applyEdgeStyles(rawEdges: RawEdge[]): any[] {
  return rawEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    states: ["hover"],
    style: {
      stroke: "#555",
      lineWidth: 1,
      labelText: edge.label,
      labelFill: "#fff",
      labelFontSize: 10,
      labelBackground: true,
      labelBackgroundRadius: 4,
      labelBackgroundOpacity: 1,
      labelTextBaseline: "middle",
      labelBackgroundStroke: "#555",
      labelBackgroundStrokeOpacity: 1,
      labelPadding: [4, 8],
      labelBackgroundLineWidth: 1,
      // 网络关系图连线应该是无向的（双向的）
      //   endArrow: true,
      //   endArrowType: "vee",
      //   endArrowSize: 10,
    },
  }));
}

/**
 * 将原始拓扑数据转换为带样式的 G6 图数据
 */
export function applyTopologyStyles(rawNodes: RawNode[], rawEdges: RawEdge[]) {
  return {
    nodes: applyNodeStyles(rawNodes),
    edges: applyEdgeStyles(rawEdges),
  };
}
