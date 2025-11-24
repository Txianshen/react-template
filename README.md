# AI智能攻防平台前端

这是一个基于 React + TypeScript + Vite 构建的AI智能攻防平台前端项目。

## 技术栈

- **框架**: React 19
- **语言**: TypeScript
- **构建工具**: Vite
- **路由**: React Router v7
- **状态管理**: Zustand
- **UI组件库**: Radix UI + Tailwind CSS
- **样式**: Tailwind CSS
- **包管理**: pnpm

## 项目结构

```
src/
├── api/                 # API接口封装
├── assets/              # 静态资源
├── components/          # 公共组件
├── guards/              # 路由守卫
├── layout/              # 布局组件
├── lib/                 # 工具库
├── pages/               # 页面组件
├── providers/           # 上下文提供者
├── router/              # 路由配置
├── store/               # 状态存储
└── App.tsx             # 根组件
```

## 快速开始

### 环境要求

- Node.js >= 18.x
- pnpm >= 8.x

### pnpm 安装

如果系统尚未安装 pnpm，可以通过以下方式安装：

```bash
# 通过 npm 安装
npm install -g pnpm

```

验证安装：

```bash
pnpm --version
```

> 注意：本项目使用 pnpm 作为包管理器，请勿使用 npm 或 yarn 安装依赖。

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev
```

默认访问地址: http://localhost:5173

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

### 代码检查与格式化

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 功能模块

- 登录认证
- 智能体管理（综合渗透、信息搜集、端口探测、Web红队等）
- 浏览器自动化
- 设置页面

## 路由配置

项目使用 Hash Router 模式，主要路由包括：

- `/login` - 登录页面
- `/app/settings` - 设置页面
- `/app/browser` - 浏览器自动化
- `/app/agents/*` - 各类智能体页面

## 主题

项目默认使用暗色主题，基于 next-themes 实现主题切换功能。
