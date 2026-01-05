import { useEffect, useState, Suspense, lazy } from "react";
import autofit from "autofit.js";
import Header from "./components/header";
import DraggableWindow from "@/components/window-panel";
// import Graph from "@/components/graph";
// import LeftTop from "./components/left-top";
// import LeftBottom from "./components/left-bottom";
// import RightBottom from "./components/right-bottom";
// import RightCenter from "./components/right-center";
// import RightTop from "./components/right-top";
// --- 关键修改：将重型子组件改为懒加载 ---
const Graph = lazy(() => import("@/components/graph"));
const LeftTop = lazy(() => import("./components/left-top"));
const LeftBottom = lazy(() => import("./components/left-bottom"));
const RightBottom = lazy(() => import("./components/right-bottom"));
const RightCenter = lazy(() => import("./components/right-center"));
const RightTop = lazy(() => import("./components/right-top"));
import Dock from "@/components/dock";
// import GlowSettingsButton from "./components/setting-btn";
import ModelSettingsDrawer from "./components/setting-drawer";
import SessionManagementDrawer from "./components/session-drawer";
// import GlowSessionButton from "./components/session-btn";
import WorkspaceButton from "./components/workspace-btn";
function CyberPage() {
  const [open, setOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
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
      {/* 左中右三列布局 */}
      <div className="grid h-full grid-cols-[1.2fr_3fr_1.2fr] gap-4">
        {/* 左侧列 - 上下 1:1 布局 */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex-1  rounded-lg p-0 relative">
            {/* <LeftTop /> */}
            <DraggableWindow
              id="left-top"
              title="语音指令"
              layoutBounds="window"
              scale={scale}
            >
              {/* <LeftTop /> */}
              {/* 关键修改：用 Suspense 包裹内容 */}
              <Suspense fallback={null}>
                <LeftTop />
              </Suspense>
            </DraggableWindow>
          </div>
          <div className="flex-3 relative rounded-lg p-0">
            {/* <LeftBottom /> */}
            <DraggableWindow
              id="right-top"
              title="后台终端"
              layoutBounds="window"
              scale={scale}
            >
              {/* <RightTop /> */}
              <Suspense fallback={null}>
                <RightTop />
              </Suspense>
            </DraggableWindow>
          </div>
        </div>

        {/* 中间列 */}
        <div className="my-4 p-4 flex flex-col relative">
          {/* <Header /> */}
          {/* 网络关系拓扑图graph */}
          <div className="flex-1 mt-4 ">
            <DraggableWindow
              id="graph"
              title="网络关系拓扑图"
              showHeader={true}
              layoutBounds="window"
              headerComponent={<Header />}
              className="bg-[transparent]"
              scale={scale}
            >
              {/* <Graph /> */}
              <Suspense fallback={null}>{<Graph />}</Suspense>
            </DraggableWindow>
          </div>
        </div>

        {/* 右侧列 - 上中下 1:1:1 布局 */}
        <div className="p-4 flex flex-col gap-4">
          <WorkspaceButton
            onOpenSettings={() => setOpen(true)}
            onOpenSessions={() => setSessionOpen(true)}
          />
          {/* <GlowSettingsButton onClick={() => setOpen(true)} />
          <GlowSessionButton onClick={() => setSessionOpen(true)} /> */}
          <ModelSettingsDrawer open={open} setOpen={setOpen} />
          <SessionManagementDrawer
            open={sessionOpen}
            setOpen={setSessionOpen}
          />
          <div className="flex-1 relative rounded-lg p-0">
            <DraggableWindow
              id="left-bottom"
              title="AI决策推理"
              layoutBounds="window"
              scale={scale}
            >
              {/* <LeftBottom /> */}
              <Suspense fallback={null}><LeftBottom /></Suspense>
            </DraggableWindow>
          </div>
          <div className="flex-1 relative rounded-lg p-0">
            {/* <RightCenter /> */}
            <DraggableWindow
              id="right-center"
              title="漏洞POC"
              layoutBounds="window"
              scale={scale}
            >
              {/* <RightCenter /> */}
              <Suspense fallback={null}><RightCenter /></Suspense>
            </DraggableWindow>
          </div>
          <div className="flex-1 relative rounded-lg p-0">
            {/* <RightBottom /> */}
            <DraggableWindow
              id="right-bottom"
              title="浏览器自动化"
              layoutBounds="window"
              scale={scale}
            >
              {/* <RightBottom /> */}
              <Suspense fallback={null}><RightBottom /></Suspense>
            </DraggableWindow>
          </div>
        </div>
      </div>
      {/* fixed布局任务栏 -- 最小化的窗口 */}
      <Dock />
    </div>
  );
}

export default CyberPage;
