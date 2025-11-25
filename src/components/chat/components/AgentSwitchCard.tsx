import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface AgentSwitchCardProps {
  title?: string;
  content: string;
  className?: string;
  defaultOpen?: boolean;
}

export function AgentSwitchCard({
  title = "➡️ 智能体发生切换",
  content,
  className,
  defaultOpen = true,
}: AgentSwitchCardProps) {
  return (
    <Accordion
      type="single"
      defaultValue={defaultOpen ? "item-1" : undefined}
      collapsible
      className={cn("border rounded-lg", className)}
    >
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="p-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center">
            <span className="text-sm font-medium">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="p-3 pt-0">
            <p className="text-xs">{content}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
