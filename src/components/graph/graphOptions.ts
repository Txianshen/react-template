/**
 * 创建 Graphin 的 options 配置
 */
export function createGraphOptions(nodes: any[], edges: any[]) {
  return {
    data: {
      nodes,
      edges,
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
      // 减小阻尼，增加"晃动感" (0.1-1.0, 越小越晃)
      damping: 0.4,
      // 减小刚度，让连线更软，更容易被拖拽拉动
      stiffness: 100,
      // 增加斥力，保证节点散开
      repulsion: 1200,
      // 防止重叠
      minNodeSpacing: 30,
    },
    // 启用交互行为
    behaviors: [
      "drag-canvas", // 拖拽画布
      "zoom-canvas", // 缩放画布
      "drag-element", // 拖拽节点
      "drag-element-force",
      "click-select",
      "auto-adapt-label",
      {
        type: "hover-activate",
        key: "click-select-1",
        state: "active",
        enable: (event: any) =>
          ["node", "edge", "canvas"].includes(event.targetType),
      },
    ],
    // 自动适配画布
    autoFit: "view",
    // 主题设置
    theme: "dark",
  };
}
