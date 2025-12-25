import { useState, useEffect, useRef } from "react";
import LoadingIcon from "@/assets/icons/loading-icon";
import { useCyberStore } from "@/store/cyberStore";
import { getSandboxUrl } from "@/api/cyber";

export default function BrowserAutomation() {
  // 从环境变量获取浏览器服务地址作为默认值
  const defaultSteelHost = "";
  // import.meta.env.VITE_STEEL_HOST || "http://47.98.234.82:8080/";

  const [loading, setLoading] = useState(true);
  const [steelHost, setSteelHost] = useState(defaultSteelHost);
  const [key, setKey] = useState(0); // 用于强制刷新 iframe

  // 从 cyberStore 获取 userId 和 sessionId
  const { userId, sessionId } = useCyberStore();

  // 创建 ref 来保存 iframe 的引用
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handleIframeLoad = () => {
    setLoading(false);

    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;
      if (!doc || !win) return;

      /* ① 干掉 iframe 内部滚动条 */
      doc.documentElement.style.overflow = "hidden";
      doc.body.style.overflow = "hidden";
      doc.body.style.margin = "0";
      doc.body.style.padding = "0";
      doc.body.style.width = "100vw";
      doc.body.style.height = "100vh";

      /* ② canvas 适配（🔥 你问的代码就在这） */
      const resizeCanvas = () => {
        const canvas = doc.querySelector("canvas");
        // if (!(canvas instanceof HTMLCanvasElement)) return;
        if (!canvas) return;
        canvas.style.maxWidth = "100%"; // Changed from width to maxWidth
        canvas.style.maxHeight = "100%"; // Changed from height to maxHeight
        // canvas.style.display = "block"; // Display property remains the same
        // canvas.style.aspectRatio = "unset"; // 🔥 关键
      };

      resizeCanvas();

      /* ③ noVNC 的 canvas 是延迟创建的，必须兜底 */
      const timer = setInterval(() => {
        if (doc.querySelector("canvas")) {
          resizeCanvas();
          clearInterval(timer);
        }
      }, 300);

      /* ④ 窗口 resize 时同步 canvas */
      win.addEventListener("resize", resizeCanvas);

      /* 清理 */
      return () => {
        clearInterval(timer);
        win.removeEventListener("resize", resizeCanvas);
      };
    } catch (e) {
      console.warn("iframe canvas adapt failed:", e);
    }
  };

  const handleLoad = () => {
    handleIframeLoad();
    setLoading(false);
  };

  // 获取沙箱 URL 的函数（只在组件挂载时调用一次）
  const fetchSandboxUrl = async () => {
    // 检查 userId 和 sessionId 是否存在
    if (!userId || !sessionId) {
      console.warn("缺少 userId 或 sessionId，无法获取沙箱 URL");
      setLoading(false);
      return;
    }

    try {
      const response = await getSandboxUrl(userId, sessionId);
      // 假设响应数据在 response.data 中
      if (response.data) {
        // 在开发环境中，将完整URL转换为代理路径
        let processedUrl = response.data;
        if (process.env.NODE_ENV === "development") {
          // 将完整的外部URL转换为相对路径，以便通过代理访问
          // 例如将 http://47.98.234.82:8000/desktop/... 转换为 /desktop/...
          processedUrl = response.data.replace(/^https?:\/\/[\w\.:\d-]+/, "");
        }
        setSteelHost(processedUrl);
        console.log("沙箱 URL 更新为:", processedUrl);
      }
    } catch (error) {
      console.error("获取沙箱 URL 失败:", error);
      // 出错时回退到默认 URL
      setSteelHost(defaultSteelHost);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取沙箱 URL，并设置定时器每10秒刷新一次 iframe
  useEffect(() => {
    // 立即调用一次获取 URL
    fetchSandboxUrl();

    // 每10秒刷新一次 iframe
    const intervalId = setInterval(() => {
      setKey((prevKey) => prevKey + 1); // 改变 key 值强制重新渲染 iframe
      setLoading(true); // 显示加载状态
    }, 100000);

    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, [userId, sessionId]);

  return (
    <div className="w-full h-full relative">
      {/* 当 steelHost 为空或者 loading 为 true 时显示加载状态 */}
      {(!steelHost || loading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
          <div className="flex flex-col items-center">
            <LoadingIcon className="animate-spin" size={128} />
            <div className="text-white text-xs font-medium mt-2">
              页面加载中...
            </div>
          </div>
        </div>
      )}
      {/* 只有当 steelHost 不为空时才渲染 iframe */}
      {steelHost && (
        <iframe
          key={key} // 通过改变 key 值强制重新加载 iframe
          src={steelHost}
          className="w-full border-none"
          style={{ height: "100%" }}
          title="浏览器自动化"
          onLoad={handleLoad}
          onError={handleLoad}
          ref={iframeRef}
        />
      )}
    </div>
  );
}
