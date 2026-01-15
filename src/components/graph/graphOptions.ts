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
      // 优化碰撞参数
      collide: {
        radius: (d: any) => {
          const size = Array.isArray(d.data?.size)
            ? d.data?.size[0]
            : d.data?.size;
          return size + 10; // 增加碰撞半径，留出更多空间
        },
        // strength: 8, // 提高碰撞强度
      },
      manyBody: {
        strength: -1000, // 增加斥力，让节点更分散
      },
      link: {
        distance: 200, // 增加连线长度
      },
      // 增加迭代次数，让布局更稳定
      maxIteration: 1000,
      // 减小阻尼，增加"晃动感" (0.1-1.0, 越小越晃)
      damping: 0.2,
      // 减小刚度，让连线更软，更容易被拖拽拉动
      stiffness: 30,
      // 增加斥力，保证节点散开
      repulsion: 3000,
      // 防止重叠
      minNodeSpacing: 60,
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
    autoFit: "view" as const,
    // 主题设置
    theme: "dark",
  };
}
