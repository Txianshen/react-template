# React + Tailwind CSS 模板

这是一个基于 React + TypeScript + Vite 的现代前端模板，集成了 Tailwind CSS、Zustand 状态管理和 React Router。

## 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| 框架 | React 19 | 核心框架 |
| 语言 | TypeScript | 类型安全 |
| 构建 | Vite 7 | 快速开发构建 |
| 路由 | React Router v7 | Hash Router 模式 |
| 状态 | Zustand 5 | 轻量状态管理 |
| 样式 | Tailwind CSS 4 | 原子化 CSS |
| 组件 | Radix UI + shadcn/ui | 无障碍 UI 组件 |
| Toast | Sonner | 轻量提示组件 |
| 表单 | React Hook Form | 高性能表单 |
| 图标 | Lucide React | 一致性图标库 |

## 项目结构

```
src/
├── api/                    # API 接口封装
│   ├── axiosInstance.ts    # Axios 实例配置
│   └── test.ts             # API 示例
├── components/             # UI 组件
│   └── ui/                 # shadcn/ui 组件
├── hooks/                  # 自定义 Hooks
├── lib/                    # 工具库
│   └── utils.ts            # 工具函数 (cn)
├── pages/                  # 页面组件
├── router/                 # 路由配置
├── store/                  # Zustand Store
├── guards/                 # 路由守卫
└── App.tsx                 # 根组件
```

## 快速开始

### 环境要求

- Node.js >= 18.x
- npm / pnpm / yarn

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 常用组件

项目集成了以下 shadcn/ui 组件，可直接使用：

- `Button` / `ButtonGroup` - 按钮组件
- `Dialog` - 对话框
- `DropdownMenu` - 下拉菜单
- `Select` - 选择器
- `Sheet` - 侧边抽屉
- `Accordion` - 手风琴
- `Form` / `Input` / `Label` - 表单组件
- `Tooltip` / `HoverCard` / `Popover` - 浮层组件
- `Slider` / `Separator` - 布局组件
- `Command` - 命令面板
- `Sonner` - Toast 提示

## 状态管理示例

```typescript
// store/demo.ts
import { create } from "zustand";

interface DemoState {
  count: number;
  increment: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 组件中使用
const count = useDemoStore((state) => state.count);
```

## Hook 示例

```typescript
// hooks/useCounter.ts
import { useState } from "react";

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}
```

## 样式工具

`cn` 函数用于合并 Tailwind 类名：

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />
```
