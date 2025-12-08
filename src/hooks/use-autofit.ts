import { useEffect } from "react";
import autofit from "autofit.js";

interface AutofitOptions {
  /** 设计稿宽度，默认 1920 */
  dw?: number;
  /** 设计稿高度，默认 1080 */
  dh?: number;
  /** 渲染的元素，默认 body */
  el?: string;
  /** 是否监听窗口变化，默认 true */
  resize?: boolean;
  /** 忽略的元素 */
  ignore?: string[];
  /** 过渡时间，默认 0 */
  transition?: number;
  /** 延迟初始化时间 */
  delay?: number;
}

/**
 * 使用 autofit.js 实现大屏自适应
 * @param options 配置项
 * @param enableLog 是否启用控制台日志，默认 false
 */
export function useAutofit(
  options: AutofitOptions = {},
  enableLog: boolean = false
) {
  useEffect(() => {
    const defaultOptions: AutofitOptions = {
      dw: 1920,
      dh: 1080,
      el: "body",
      resize: true,
      ...options,
    };

    autofit.init(defaultOptions, enableLog);

    return () => {
      autofit.off();
    };
  }, [options, enableLog]);
}
