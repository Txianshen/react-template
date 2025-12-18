import { Graphin } from "@antv/graphin";
// import routerSVG from "@/assets/icons/cyber/router.svg";
// import bgpSvg from "@/assets/icons/cyber/bgp.svg";
// import hostSvg from "@/assets/icons/cyber/host.svg";
// import networkSvg from "@/assets/icons/cyber/network.svg";
import { container } from "@/lib/container";
console.log(container); // Log the container object for debugging purposes

// 数据处理
const parseSeedEmuToTopology = (jsonArray) => {
  const nodesMap = new Map();
  const edges = [];

  const config = {
    BorderRouter: {
      color: "#FF7675",
      size: 60,
      badge: "R",
      type: "graphin-circle",
    },
    Host: { color: "#74B9FF", size: 60, badge: "H", type: "graphin-rect" },
    "Route Server": {
      color: "#FFEAA7",
      size: 60,
      badge: "S",
      type: "graphin-circle",
    },
    Network: { color: "#55EFC4", size: 60, badge: "", type: "graphin-circle" },
    IX: { color: "#A29BFE", size: 60, badge: "IX", type: "graphin-circle" },
  };

  const addNode = (id, label, role, meta = {}, isNetwork = false) => {
    if (!nodesMap.has(id)) {
      let styleConfig;
      let displayLabel = label;

      if (isNetwork) {
        const isIX = label.startsWith("ix");
        styleConfig = isIX ? config.IX : config.Network;
        if (isIX) displayLabel = label;
      } else {
        styleConfig = config[role] || config.Host;
      }

      nodesMap.set(id, {
        id: id,
        data: { ...meta, role, isNetwork },
        style: {
          zIndex: 1,
          // BaseShapeStyleProps
          size: styleConfig.size,
          fill: styleConfig.color,
          stroke: styleConfig.color,
          lineWidth: 2,
          fillOpacity: 0.4,

          // NodeLabelStyleProps
          labelText: displayLabel,
          labelPlacement: "bottom",
          labelFill: "#e6e6e6",
          labelFontSize: 12,
          labelOffsetY: 4,
          labelWordWrap: true,
          labelMaxWidth: 120,

          // BadgeStyleProps
          badges: styleConfig.badge
            ? [
                {
                  text: styleConfig.badge,
                  placement: "right-top",
                  backgroundFill: styleConfig.color,
                  fill: "#fff",
                  fontSize: 9,
                  // padding: [1, 3],
                  // radius: ,
                },
              ]
            : [],
        },
        states: ["focus"],
      });
    }
  };

  jsonArray.forEach((container) => {
    if (!container.meta || !container.meta.emulatorInfo) return;
    const info = container.meta.emulatorInfo;
    const asn = info.asn;
    const containerId = container.Id;

    const nodeLabel = `${asn}/${info.name}`;
    addNode(containerId, nodeLabel, info.role, info, false);

    if (info.nets && Array.isArray(info.nets)) {
      info.nets.forEach((net) => {
        const netName = net.name;
        const networkNodeId = netName.startsWith("ix")
          ? `global_${netName}`
          : `as${asn}_${netName}`;
        const networkLabel = netName.startsWith("ix")
          ? netName
          : `${asn}/${netName}`;

        addNode(
          networkNodeId,
          networkLabel,
          "Network",
          { type: "network", name: netName },
          true
        );

        edges.push({
          source: containerId,
          target: networkNodeId,
          states: ["hover"],
          style: {
            stroke: "#555",
            lineWidth: 1,
            labelText: net.address,
            labelFill: "#fff", // 边标签文字颜色
            labelFontSize: 10,
            labelBackground: true,
            // labelBackgroundFill: "transparent",
            labelBackgroundRadius: 4,
            labelBackgroundOpacity: 1,
            labelTextBaseline: "middle",
            labelBackgroundStroke: "#555",
            labelBackgroundStrokeOpacity: 1,
            labelPadding: [4, 8],
            labelBackgroundLineWidth: 1,
            endArrow: true, // 结束端箭头
            endArrowType: "vee", // 箭头类型
            endArrowSize: 10, // 箭头大小
          },
        });
      });
    }
  });

  return { nodes: Array.from(nodesMap.values()), edges };
};

console.log(
  "SEEDEMU数据处理后获得的节点和边:",
  parseSeedEmuToTopology(container)
);

export default function Graph() {
  const { nodes, edges } = parseSeedEmuToTopology(container);
  const options = {
    data: {
      nodes: nodes,
      edges: edges,
    },
    layout: {
      type: "d3-force",
      preventOverlap: true,
      collide: {
        radius: (d: any) => {
          const size = Array.isArray(d.data?.size)
            ? d.data?.size[0]
            : d.data?.size;
          return size + 10; // 增加碰撞半径，留出更多空间
        },
        strength: 4, // 提高碰撞强度
      },
      manyBody: {
        strength: -800, // 增加斥力，让节点分散
      },
      link: {
        distance: 200, // 增加连线长度
      },
      // 减小阻尼，增加“晃动感” (0.1-1.0, 越小越晃)
      damping: 0.4,
      // 减小刚度，让连线更软，更容易被拖拽拉动
      stiffness: 100,
      // 增加斥力，保证节点散开
      repulsion: 1200,
      // 防止重叠
      minNodeSpacing: 30,
    }, // d3力导布局
    // 启用交互行为
    behaviors: [
      "drag-canvas", // 拖拽画布
      "zoom-canvas", // 缩放画布
      "drag-element", // 拖拽节点
      "drag-element-force",
    ],
    // 自动适配画布
    autoFit: "view",
    // 主题设置
    theme: "dark",
    // node: {
    //   style: {
    //     halo: true,
    //     haloStroke: "orange",
    //     haloLineWidth: 6,
    //     haloStrokeOpacity: 0.5,
    //   },
    // },
  };

  return (
    <div className="h-full w-full">
      <Graphin options={options as any} />
    </div>
  );
}
