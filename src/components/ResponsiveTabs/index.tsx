import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

// 定义 TabItem 类型
interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

// 定义组件 Props 类型
interface ResponsiveTabsProps {
  tabItems: TabItem[];
  value?: string; // 当前激活的 tab
  onValueChange?: (value: string) => void; // tab 切换回调
  defaultValue?: string; // 默认激活的 tab
}

const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  tabItems,
  value,
  onValueChange,
  defaultValue,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [visibleCount, setVisibleCount] = useState(tabItems.length);
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  const visibleTabs = tabItems.slice(0, visibleCount);
  const hiddenTabs = tabItems.slice(visibleCount);

  // 测量所有 Tab 的实际宽度
  useEffect(() => {
    const measureTabWidths = () => {
      const widths = tabRefs.current.map((ref) => {
        if (ref) {
          // 获取元素的实际宽度,包括 padding 和 margin
          const rect = ref.getBoundingClientRect();
          const styles = window.getComputedStyle(ref);
          const marginLeft = parseFloat(styles.marginLeft);
          const marginRight = parseFloat(styles.marginRight);
          return rect.width + marginLeft + marginRight;
        }
        return 0;
      });
      setTabWidths(widths);
    };

    // 延迟测量,确保 DOM 已渲染
    const timer = setTimeout(measureTabWidths, 0);
    return () => clearTimeout(timer);
  }, [tabItems]);

  useEffect(() => {
    if (tabWidths.length === 0) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const containerWidth = entry.contentRect.width;
      const moreButtonWidth = 60; // 扩展按钮宽度

      let totalWidth = 0;
      let count = 0;
      const totalTabsWidth = tabWidths.reduce((sum, w) => sum + w, 0);

      if (totalTabsWidth <= containerWidth) {
        // 所有按钮都能显示,不需要扩展按钮
        count = tabItems.length;
      } else {
        // 需要计算能显示多少个按钮
        const availableWidth = containerWidth - moreButtonWidth;
        for (let i = 0; i < tabWidths.length; i++) {
          if (totalWidth + tabWidths[i] <= availableWidth) {
            totalWidth += tabWidths[i];
            count++;
          } else {
            break;
          }
        }
      }

      // 至少显示 2 个(防止全被隐藏)
      setVisibleCount(Math.max(2, Math.min(tabItems.length, count)));
    });

    if (tabsContainerRef.current) observer.observe(tabsContainerRef.current);
    return () => observer.disconnect();
  }, [tabItems.length, tabWidths]);

  // 处理下拉菜单中 tab 的点击
  const handleHiddenTabClick = (tabValue: string) => {
    onValueChange?.(tabValue);
    setIsDropdownOpen(false);
  };

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue || tabItems[0]?.value}
    >
      <TabsList
        ref={tabsContainerRef}
        className="flex w-full overflow-hidden justify-start"
      >
        {visibleTabs.map((tab, index) => {
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!flex-none"
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
            >
              {tab.label}
            </TabsTrigger>
          );
        })}
        {/* 隐藏的 Tab 用于测量宽度 */}
        {hiddenTabs.map((tab, index) => {
          const actualIndex = visibleTabs.length + index;
          return (
            <TabsTrigger
              key={`hidden-${tab.value}`}
              value={tab.value}
              className="!flex-none invisible absolute pointer-events-none"
              ref={(el) => {
                tabRefs.current[actualIndex] = el;
              }}
              tabIndex={-1}
            >
              {tab.label}
            </TabsTrigger>
          );
        })}

        {/* 更多按钮 - 只有在初始化完成且有隐藏的 tab 时才显示 */}
        {hiddenTabs.length > 0 && (
          <div className="flex-shrink-0">
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 data-[state=active]:bg-transparent"
                >
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {hiddenTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    onClick={() => handleHiddenTabClick(tab.value)}
                  >
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </TabsList>
    </Tabs>
  );
};

export default ResponsiveTabs;
