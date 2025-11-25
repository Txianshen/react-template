// 组件类别封装：
// 1. thinking （思考过程）
// 2. 工具调用卡片（tool）
// 3. 智能体切换提示 （也用卡片可能和工具调用的卡片有点区别没有loading 和 duration）
// 4 选择项组件（yes/no）

import Reasoning from "./components/Reasoning";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from "@/components/ai-elements/confirmation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageToolbar,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import { AgentSwitchCard } from "./components/AgentSwitchCard";

// 1. 思考过程组件 (复用 Reasoning 组件)
export { Reasoning };

// 2. 工具调用卡片组件 (复用 Tool 组件)
export { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput };

// 3. 智能体切换提示卡片组件 (基于 Card 组件实现)
export { AgentSwitchCard };

// 4. 选择项组件 (复用 Confirmation 组件)
export {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
};

// 5. 消息组件 (复用 Message 组件)
export {
  Message,
  MessageContent,
  MessageResponse,
  MessageToolbar,
  MessageActions,
  MessageAction,
};
