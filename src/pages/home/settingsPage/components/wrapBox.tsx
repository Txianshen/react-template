import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WrapBoxProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export default function WrapBox({
  title,
  description,
  children,
  className,
}: WrapBoxProps) {
  return (
    <div
      className={cn("wrap-box space-y-2 py-2.5 px-3  rounded-md", className)}
    >
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
