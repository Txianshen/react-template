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
  const [visibleCount, setVisibleCount] = useState(tabItems.length);

  const visibleTabs = tabItems.slice(0, visibleCount);
  const hiddenTabs = tabItems.slice(visibleCount);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      const buttonWidth = 150; // 每个按钮占的宽度（包括间距）
      const moreButtonWidth = 60; // 扩展按钮宽度
      let count;
      const totalButtonsWidth = tabItems.length * buttonWidth;
      if (totalButtonsWidth <= width) {
        // 所有按钮都能显示，不显示扩展按钮
        count = tabItems.length;
      } else {
        // 按钮超出容器，需要显示扩展按钮
        count = Math.floor((width - moreButtonWidth) / buttonWidth);
      }
      console.log("width", width, count);
      // 至少显示 2 个（防止全被隐藏）
      setVisibleCount(Math.max(2, Math.min(tabItems.length, count)));
    });

    if (tabsContainerRef.current) observer.observe(tabsContainerRef.current);
    return () => observer.disconnect();
  }, [tabItems.length]);

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
        {visibleTabs.map((tab) => {
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="!flex-none"
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
