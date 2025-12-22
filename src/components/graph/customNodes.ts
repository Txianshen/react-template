import { Circle, register, ExtensionCategory } from "@antv/g6";

/**
 * 自定义圆形图片节点
 * 继承内置的 Circle 节点，在圆形基础上添加图片
 */
class CircleImageNode extends Circle {
  /**
   * 重写 render 方法
   * @param attributes 经过映射后的节点样式属性（包含 x, y, r, fill, 以及我们自定义的 icon, iconSize 等）
   * @param container 图形容器
   */
  render(attributes: any, container: any) {
    // 1. 调用父类 render，绘制最底层的圆形 (keyShape)
    // 这一步保证了选中框是圆的，连线也是连到圆边上
    super.render(attributes, container);

    // 2. 从属性中获取我们需要的数据
    const {
      icon, // 图片地址
      iconSize = 20, // 图片大小，给一个默认值
    } = attributes;

    // 3. 使用 upsert 方法添加或更新图片图形
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

/**
 * 注册自定义节点
 * 需要在使用前调用一次
 */
export function registerCustomNodes() {
  register(ExtensionCategory.NODE, "circle-image", CircleImageNode);
}

// 默认导出节点类（如果需要扩展）
export { CircleImageNode };
