import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageResponse } from "@/components/ai-elements/message";

export default function PlanPanel() {
  // 示例 Markdown 内容，实际使用时应该从 props 传入
  const markdownContent = `🔍 暂无渗透计划`;

  return (
    <AccordionItem value="plan" className="border rounded-lg ">
      <AccordionTrigger className="hover:no-underline">
        当前任务状态
      </AccordionTrigger>
      <AccordionContent className="pt-0">
        <div className="rounded-md text-sm">
          <MessageResponse className="prose prose-sm dark:prose-invert max-w-none">
            {markdownContent}
          </MessageResponse>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
