import BoxHeader from "./components/boxHeader";
import type { ReactNode } from "react";

interface BoxWrapProps {
  title?: string;
  children?: ReactNode;
}

export default function BoxWrap({ title, children }: BoxWrapProps) {
  return (
    <div className="box-wrap flex flex-col h-full border border-[#536FA9]/60 relative before:absolute before:top-0 before:left-0 before:w-4 before:h-4 before:border-t-[3px] before:border-l-[3px] before:border-[#00D9FF] after:absolute after:top-0 after:right-0 after:w-4 after:h-4 after:border-t-[3px] after:border-r-[3px] after:border-[#00D9FF]">
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-[#00D9FF]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-[#00D9FF]" />
      <BoxHeader title={title} />
      {/* 内容区域 */}
      <div className="p-4 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
