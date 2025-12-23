import { Circle, register, ExtensionCategory } from "@antv/g6";

/**
 * 自定义圆形图片节点
 * 继承内置的 Circle 节点，在圆形基础上添加图片和蒙层效果
 */
class CircleImageNode extends Circle {
  /**
   * 重写 render 方法
   * @param attributes 经过映射后的节点样式属性
   * @param container 图形容器
   */
  render(attributes: any, container: any) {
    // 1. 调用父类 render，绘制最底层的圆形 (keyShape)
    super.render(attributes, container);

    // 2. 从属性中获取数据
    const {
      icon, // 图片地址
      iconSize = 20, // 图片大小
      // 蒙层配置
      overlay = false, // 是否显示蒙层
      overlayFill = "#c0392b", // 蒙层颜色（默认深红色）
      overlayOpacity = 0.6, // 蒙层透明度
    } = attributes;

    // 3. 添加图片图形
    this.upsert(
      "icon-image",
      "image",
      {
        x: -iconSize / 2,
        y: -iconSize / 2,
        width: iconSize,
        height: iconSize,
        src: icon,
        cursor: "pointer",
      },
      container
    );

    // 4. 添加蒙层效果（在图片上方叠加半透明红色圆形）
    // 蒙层用于表示节点被"攻破/感染"的状态
    if (overlay) {
      const overlayRadius = iconSize / 2;
      this.upsert(
        "overlay-circle",
        "circle",
        {
          cx: 0,
          cy: 0,
          r: overlayRadius,
          fill: overlayFill,
          fillOpacity: overlayOpacity,
          cursor: "pointer",
        },
        container
      );
    } else {
      // 不需要蒙层时，移除蒙层图形（如果存在）
      const overlayShape = this.shapeMap["overlay-circle"];
      if (overlayShape) {
        overlayShape.remove();
        delete this.shapeMap["overlay-circle"];
      }
    }
  }
}

/**
 * 注册自定义节点
 * 需要在使用前调用一次
 */
export function registerCustomNodes() {
  register(ExtensionCategory.NODE, "circle-image", CircleImageNode);
}

// 默认导出节点类（如果需要扩展）
export { CircleImageNode };
