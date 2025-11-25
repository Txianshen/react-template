// 组件类别封装：
// 1. thinking （思考过程）
// 2. 工具调用卡片（tool）
// 3. 智能体切换提示 （也用卡片可能和工具调用的卡片有点区别没有loading 和 duration）
// 4 选择项组件（yes/no）
// 5. message消息组件包括Message、 MessageContent、MessageResponse、 MessageToolbar、MessageActions、MessageAction

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 1. 思考过程组件 (复用 Reasoning 组件)
export { Reasoning, ReasoningContent, ReasoningTrigger };

// 2. 工具调用卡片组件 (复用 Tool 组件)
export { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput };

// 3. 智能体切换提示卡片组件 (基于 Card 组件实现)
export function AgentSwitchCard({
  title = "➡️ 智能体发生切换",
  content,
  className,
}: {
  title?: string;
  content: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-sm">{content}</p>
      </CardContent>
    </Card>
  );
}

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
