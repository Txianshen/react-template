import { useState } from "react";
import LoadingIcon from "@/assets/icons/loading-icon";

export default function BrowserAutomation() {
  // 从环境变量获取浏览器服务地址
  const steelHost =
    import.meta.env.VITE_STEEL_HOST || "http://47.98.234.82:8080/";

  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
          <div className="flex flex-col items-center">
            <LoadingIcon className="animate-spin" size={128} />
            <div className="text-white text-xs font-medium mt-2">
              页面加载中...
            </div>
          </div>
        </div>
      )}
      <iframe
        src={steelHost}
        className="w-full border-none"
        style={{ height: "100%" }}
        title="浏览器自动化"
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </div>
  );
}
