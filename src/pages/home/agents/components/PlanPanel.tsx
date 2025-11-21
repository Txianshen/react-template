import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PlanPanel() {
  return (
    <AccordionItem
      value="plan"
      className="border rounded-lg bg-background px-4"
    >
      <AccordionTrigger className="hover:no-underline">
        当前任务状态
      </AccordionTrigger>
      <AccordionContent className="pt-3">
        <div className="p-3 bg-muted rounded-md text-sm">
          <p className="text-muted-foreground">🔍 暂无渗透计划</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
