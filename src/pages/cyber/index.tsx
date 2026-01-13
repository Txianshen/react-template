import { useEffect, useState, Suspense, lazy } from "react";
import autofit from "autofit.js";
import { useCyberStore } from "@/store/cyberStore";
const AlternativeLayout = lazy(() => import("./components/alternative-layout"));
const DefaultLayout = lazy(() => import("./components/default-layout"));
import Dock from "@/components/dock";
// import ModelSettingsDrawer from "./components/setting-drawer";
import SessionManagementDrawer from "./components/session-drawer";
import WorkspaceButton from "./components/workspace-btn";
import TTSMessageDisplay from "@/components/tts-message-display";
function CyberPage() {
  // const [open, setOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const { currentConfig } = useCyberStore();
  useEffect(() => {
    // 只在 Cyber 大屏页面启用 autofit
    autofit.init(
      {
        dh: 1080, // 设计稿高度
        dw: 3840, // 设计稿宽度
        el: "#cyber-screen", // 只缩放这个容器
        resize: true,
      },
      false
    );
    return () => {
      autofit.off();
    };
  }, []);
  const [scale, setScale] = useState(1);
  function getAutofitScale() {
    const scaleX = window.innerWidth / 3840;
    const scaleY = window.innerHeight / 1080;
    return Math.min(scaleX, scaleY);
  }

  useEffect(() => {
    const update = () => {
      setScale(getAutofitScale());
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      id="cyber-screen"
      className="h-[1080px] w-[3840px] bg-cover bg-center bg-no-repeat bg-[url('@/assets/icons/cyber/cyber-bg.svg')]"
    >
      <WorkspaceButton onOpenSessions={() => setSessionOpen(true)} />
      {/* 根据运行模式决定布局 */}
      {currentConfig?.run_mode === "展厅模式" ? (
        <>
          {/* 展厅模式：使用默认布局  */}
          <Suspense fallback={null}>
            <DefaultLayout scale={scale} />
          </Suspense>
          {/* TTS消息显示 */}
          <TTSMessageDisplay />
        </>
      ) : (
        /* 非展厅模式：左右两列布局 */
        <Suspense fallback={null}>
          <AlternativeLayout scale={scale} />
        </Suspense>
      )}
      {/* <ModelSettingsDrawer open={open} setOpen={setOpen} /> */}
      <SessionManagementDrawer open={sessionOpen} setOpen={setSessionOpen} />

      {/* fixed布局任务栏 -- 最小化的窗口 */}
      <Dock />
    </div>
  );
}

export default CyberPage;
