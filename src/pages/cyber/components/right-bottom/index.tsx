// 浏览器自动化
import { forwardRef, useImperativeHandle, useState } from "react";
import BrowserAutomation from "@/components/browser-automation";

const RightBottom = forwardRef((props, ref) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      setRefreshTrigger((prev) => prev + 1);
    },
  }));

  return <BrowserAutomation key={refreshTrigger} />;
});

RightBottom.displayName = "RightBottom";

export default RightBottom;
