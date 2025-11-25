import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AgentSwitchCardProps {
  title?: string;
  content: string;
  className?: string;
}

export function AgentSwitchCard({
  title = "➡️ 智能体发生切换",
  content,
  className,
}: AgentSwitchCardProps) {
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
