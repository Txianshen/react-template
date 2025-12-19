import { Graphin } from "@antv/graphin";
import routerSVG from "@/assets/icons/cyber/router.svg";
import bgpSvg from "@/assets/icons/cyber/bgp.svg";
import hostSvg from "@/assets/icons/cyber/host.svg";
import networkSvg from "@/assets/icons/cyber/network.svg";
import { container } from "@/lib/container";
import { useRef } from "react";
import { Circle, register, ExtensionCategory } from "@antv/g6";

// 1. 定义一个类，继承内置的 Circle 节点
class CircleImageNode extends Circle {
  /**
   * 重写 render 方法
   * @param attributes 经过映射后的节点样式属性（包含 x, y, r, fill, 以及我们自定义的 icon, iconSize 等）
   * @param container 图形容器
   */
  render(attributes, container) {
    // 1. 调用父类 render，绘制最底层的圆形 (keyShape)
    // 这一步保证了选中框是圆的，连线也是连到圆边上
    super.render(attributes, container);

    // 2. 从属性中获取我们需要的数据
    // 注意：这里的数据通常来自你在 data.nodes[i].style 中配置的字段
    const {
      icon, // 图片地址
      iconSize = 20, // 图片大小，给一个默认值
      r = 15, // 圆的半径，用于计算居中
    } = attributes;

    // 3. 使用 upsert 方法添加或更新图片图形
    // upsert(图形ID, 图形类型, 图形样式, 容器)
    this.upsert(
      "icon-image", // 给这个图片图形起个唯一的内部 ID
      "image", // 图形类型是 image
      {
        x: -iconSize / 2, // 居中定位：向左偏移一半宽度
        y: -iconSize / 2, // 居中定位：向上偏移一半高度
        width: iconSize,
        height: iconSize,
        src: icon, // 图片 URL
        cursor: "pointer", // 鼠标放上去变小手
      },
      container
    );
  }
}

// 2. 注册这个自定义节点
register(ExtensionCategory.NODE, "circle-image", CircleImageNode);

// 数据处理
const parseSeedEmuToTopology = (jsonArray) => {
  const nodesMap = new Map();
  const edges = [];
  const size = 60;
  const config = {
    BorderRouter: {
      color: "#FF7675",
      size: size,
      badge: "R",
      src: routerSVG,
    },
    Host: {
      color: "#FF7675",
      size: size,
      badge: "H",
      src: hostSvg,
    },
    "Route Server": {
      color: "#FF7675",
      size: size,
      badge: "S",
      src: hostSvg,
    },
    Network: {
      color: "#FF7675",
      size: size,
      badge: "",
      src: networkSvg,
    },
    IX: {
      color: "#FF7675",
      size: size,
      badge: "IX",
      src: bgpSvg,
    },
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
        type: "circle-image", // 自定义cirle-image
        data: {
          ...meta,
          role,
          isNetwork,
        },
        style: {
          // 节点图片样式设置
          zIndex: 1,
          // BaseShapeStyleProps
          size: styleConfig.size, // 控制节点大小

          fill: "orange", // 点击selected光晕效果
          // stroke: styleConfig.color,

          // 3. 图片配置
          icon: styleConfig.src, // 自定义icon图片路径属性
          iconSize: 60, // <--- 完美控制图片大小，可以比 r 大，也可以比 r 小

          fillOpacity: 0.4,
          // NodeLabelStyleProps---节点文本样式设置
          labelText: displayLabel,
          labelPlacement: "bottom",
          labelFill: "#e6e6e6",
          labelFontSize: 12,
          labelOffsetY: 4,
          labelWordWrap: true,
          labelMaxWidth: 120,

          // BadgeStyleProps--徽标样式设置
          badges: styleConfig.badge
            ? [
                {
                  text: styleConfig.badge,
                  placement: "right",
                  backgroundFill: styleConfig.color,
                  fill: "#fff",
                  fontSize: 9,
                  // padding: [3, 4, 1, 4],
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
  const graphRef = useRef();
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
      "click-select",
      // "focus-element", // 聚焦特定元素，自动调整视图
      "auto-adapt-label",
      {
        type: "hover-activate",
        key: "click-select-1",
        state: "active", // 选中的状态
        //⚠️ 注意，这里需要同时设置节点和画布，否则用户点击画布时将不会监听到事件
        enable: (event) =>
          ["node", "edge", "canvas"].includes(event.targetType),
      },
    ],
    // 自动适配画布
    autoFit: "view",
    // 主题设置
    theme: "dark",
  };

  return (
    <div className="h-full w-full">
      <Graphin ref={graphRef} options={options} />
    </div>
  );
}
