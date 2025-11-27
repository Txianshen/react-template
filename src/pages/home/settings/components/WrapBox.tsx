import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WrapBoxProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  titleExtra?: ReactNode; // 标题右侧的额外内容
}

export default function WrapBox({
  title,
  description,
  children,
  className,
  titleExtra,
}: WrapBoxProps) {
  return (
    <div
      className={cn("wrap-box space-y-2 py-2.5 px-3  rounded-md", className)}
    >
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{title}</h3>
          {titleExtra && (
            <div className="flex items-center gap-2">{titleExtra}</div>
          )}
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
