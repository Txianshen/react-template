import { useState, useEffect, useRef } from "react";

interface AnimationOptions {
  duration?: number;
  decimals?: number;
}

export const useNumberAnimation = (
  targetValue: number,
  options: AnimationOptions = {}
) => {
  const { duration = 800, decimals = 0 } = options;
  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    // 更新起始值为当前显示的值
    startValueRef.current = animatedValue;

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // 使用easeOutCubic缓动函数
      const eased = 1 - Math.pow(1 - progress, 3);
      const current =
        startValueRef.current + (targetValue - startValueRef.current) * eased;

      setAnimatedValue(
        decimals > 0
          ? parseFloat(current.toFixed(decimals))
          : Math.round(current)
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // 动画结束时确保精确到达目标值
        setAnimatedValue(targetValue);
      }
    };

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, duration, decimals]);

  return animatedValue;
};
