import { useEffect, useState, Suspense, lazy } from "react";

import autofit from "autofit.js";
import { useCurrentSessionConfig } from "@/store/cyberStore";

const AlternativeLayout = lazy(() => import("./components/alternative-layout"));
const DefaultLayout = lazy(() => import("./components/default-layout"));
import Dock from "@/components/dock";
import SessionManagementDrawer from "./components/session-drawer";
import WorkspaceButton from "./components/workspace-btn";
import TTSMessageDisplay from "@/components/tts-message-display";
import { useSessionBootstrap } from "@/hooks/use-session-bootstrap";
function CyberPage() {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const currentSessionConfig = useCurrentSessionConfig();

  useSessionBootstrap();

  useEffect(() => {
    autofit.init(
      {
        dh: 1080,
        dw: 3840,
        el: "#cyber-screen",
        resize: true,
      },
      false
    );
    return () => autofit.off();
  }, []);

  useEffect(() => {
    const update = () => {
      const scaleX = window.innerWidth / 3840;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
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
      <WorkspaceButton
        onOpenSessions={() => setSessionOpen(true)}
        isExhibitionMode={currentSessionConfig?.run_mode === "展厅模式"}
      />

      {currentSessionConfig?.run_mode === undefined ? (
        <></>
      ) : currentSessionConfig?.run_mode === "展厅模式" ? (
        <>
          <Suspense fallback={null}>
            <DefaultLayout scale={scale} />
          </Suspense>
          <TTSMessageDisplay />
        </>
      ) : (
        <Suspense fallback={null}>
          <AlternativeLayout scale={scale} />
        </Suspense>
      )}

      <SessionManagementDrawer open={sessionOpen} setOpen={setSessionOpen} />

      <Dock />
    </div>
  );
}

export default CyberPage;
