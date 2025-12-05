import { Graphin } from "@antv/graphin";

// import "@antv/graphin/dist/index.css";
// import "@antv/graphin-components/dist/index.css";

export default function Graph() {
  const options = {
    data: {
      nodes: [
        {
          id: "router-center",
          data: {
            label: "wlx100\n10.100.0.150/24",
            type: "router",
            nodeType: "star",
            size: 60,
            color: "#5B8FF9",
          },
        },
        {
          id: "host-1",
          data: {
            label: "152\nrouter0\n10.100.0.152/24",
            type: "host",
            nodeType: "circle",
            size: 50,
            color: "#61DDAA",
          },
        },
        {
          id: "router-1",
          data: {
            label: "151\nrouter0\nTS1-0.254",
            type: "router",
            nodeType: "circle",
            size: 50,
            color: "#D580FF",
          },
        },
        {
          id: "router-2",
          data: {
            label: "150\nrouter0\n10.150.0.254/24",
            type: "router",
            nodeType: "circle",
            size: 50,
            color: "#FF9580",
          },
        },
        {
          id: "host-vulnerable-1",
          data: {
            label: "150\nvulnerable_brute",
            type: "vulnerable",
            nodeType: "hexagon",
            size: 45,
            color: "#FF7875",
          },
        },
        {
          id: "host-2",
          data: {
            label: "100\ntx100",
            type: "host",
            nodeType: "hexagon",
            size: 45,
            color: "#5B8FF9",
          },
        },
        {
          id: "firewall",
          data: {
            label: "150\nnet0\n10.150.0.10\n10.150.0.71/24",
            type: "firewall",
            nodeType: "diamond",
            size: 50,
            color: "#FF7875",
          },
        },
        {
          id: "host-vulnerable-2",
          data: {
            label: "150\nvulnerable_cmdinjection",
            type: "vulnerable",
            nodeType: "hexagon",
            size: 45,
            color: "#5B8FF9",
          },
        },
        {
          id: "host-3",
          data: {
            label: "152",
            type: "host",
            nodeType: "hexagon",
            size: 40,
            color: "#FF7875",
          },
        },
        {
          id: "network-1",
          data: {
            label: "152.0.0.0/8.2.254/24",
            type: "network",
            nodeType: "rect",
            size: [80, 30],
            color: "#4A90E2", // 改为深蓝色，更协调
          },
        },
      ],
      edges: [
        { source: "network-1", target: "host-1", data: { label: "" } },
        { source: "host-1", target: "router-center", data: { label: "" } },
        {
          source: "router-center",
          target: "router-1",
          data: { label: "10.100.0.191/24" },
        },
        { source: "router-center", target: "router-2", data: { label: "" } },
        {
          source: "router-center",
          target: "host-2",
          data: { label: "0.100.0.100/24" },
        },
        {
          source: "router-2",
          target: "firewall",
          data: { label: "10.150.0.2" },
        },
        {
          source: "router-2",
          target: "host-vulnerable-1",
          data: { label: "" },
        },
        {
          source: "firewall",
          target: "host-vulnerable-2",
          data: { label: "10.150.0.10" },
        },
        { source: "firewall", target: "host-3", data: { label: "" } },
      ],
    },
    layout: {
      type: "force",
      preventOverlap: true,
      nodeStrength: 1000,
      edgeStrength: 200,
      animated: true, // 启用动画
    },
    // 启用交互行为
    behaviors: [
      "drag-canvas", // 拖拽画布
      "zoom-canvas", // 缩放画布
      "drag-element", // 拖拽节点
    ],
    // 自动适配画布
    autoFit: "view",
    node: {
      style: {
        labelText: (d: any) => d.data.label,
        labelFontSize: 10,
        labelFill: "#fff", // 设置标签文本颜色为白色
        labelBackground: false, // 移除标签背景
        labelPadding: 2,
        size: (d: any) => d.data.size || 40,
        fill: (d: any) => d.data.color || "#5B8FF9",
      },
      state: {
        // 悬停状态
        hover: {
          lineWidth: 2,
          stroke: "#000",
        },
        // 选中状态
        selected: {
          lineWidth: 3,
          stroke: "#f00",
        },
      },
      type: (d: any) => d.data.nodeType || "circle",
    } as any,
    edge: {
      style: {
        labelText: (d: any) => d.data.label || "",
        labelFontSize: 8,
        labelFill: "#fff", // 设置边标签文本颜色为白色
        stroke: "#fff",
        lineWidth: 1,
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Graphin options={options as any} />
    </div>
  );
}
