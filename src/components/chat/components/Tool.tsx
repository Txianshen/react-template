import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageResponse } from "@/components/ai-elements/message";

import { cn } from "@/lib/utils";
import { Loader2, CheckCircle } from "lucide-react";

export interface ToolProps {
  title?: string;
  content: string;
  className?: string;
  defaultOpen?: boolean;
  status?: "pending" | "done";
  duration?: number;
}

export function Tool({
  title = "工具调用",
  content,
  className,
  defaultOpen = true,
  status,
  duration,
}: ToolProps) {
  return (
    <Accordion
      type="single"
      defaultValue={defaultOpen ? "item-1" : undefined}
      collapsible
      className={cn("rounded-lg", className)}
    >
      <AccordionItem value="item-1" className="border">
        <AccordionTrigger className="p-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="flex items-center">
              {status ? (
                status === "pending" ? (
                  <Loader2 className="size-4 text-gray-500 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="size-4 text-green-500 mr-1" />
                    {duration !== undefined && (
                      <span className="text-xs text-gray-500">
                        {duration.toFixed(2)}s
                      </span>
                    )}
                  </>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="p-3 pt-0">
            <MessageResponse>{content}</MessageResponse>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
