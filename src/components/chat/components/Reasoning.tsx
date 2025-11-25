import {
  Reasoning as AIReasoning,
  ReasoningContent as AIReasoningContent,
  ReasoningTrigger as AIReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type ReasoningProps = {
  isStreaming?: boolean;
  content?: string;
  className?: string;
} & ComponentProps<typeof AIReasoning>;

const Reasoning = ({
  isStreaming,
  content,
  className,
  ...props
}: ReasoningProps) => {
  return (
    <div className={cn("w-full p-4", className)}>
      <AIReasoning className="w-full" isStreaming={isStreaming} {...props}>
        <AIReasoningTrigger />
        <AIReasoningContent>{content || ""}</AIReasoningContent>
      </AIReasoning>
    </div>
  );
};

export default Reasoning;
