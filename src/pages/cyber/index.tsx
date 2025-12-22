import { useEffect, useState } from "react";
import autofit from "autofit.js";
import Header from "./components/header";
import DraggableWindow from "@/components/window-panel";
import Graph from "@/components/graph";
import LeftTop from "./components/left-top";
import LeftBottom from "./components/left-bottom";
import RightBottom from "./components/right-bottom";
import RightCenter from "./components/right-center";
import RightTop from "./components/right-top";
import Dock from "@/components/dock";
import GlowSettingsButton from "./components/setting-btn";
import ModelSettingsDrawer from "./components/setting-drawer";
function CyberPage() {
  const [open, setOpen] = useState(false);
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
            {/* <DraggableWindow
              id="left-top"
              title="语音指令"
              layoutBounds="window"
              scale={scale}
            >
              <LeftTop />
            </DraggableWindow> */}
          </div>
          <div className="flex-3 relative rounded-lg p-0">
            {/* <LeftBottom /> */}
            {/* <DraggableWindow
              id="right-top"
              title="后台终端"
              layoutBounds="window"
              scale={scale}
            >
              <RightTop />
            </DraggableWindow> */}
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
              <Graph />
            </DraggableWindow>
          </div>
        </div>

        {/* 右侧列 - 上中下 1:1:1 布局 */}
        <div className="p-4 flex flex-col gap-4">
          <GlowSettingsButton onClick={() => setOpen(true)} />
          <ModelSettingsDrawer open={open} setOpen={setOpen} />
          <div className="flex-1 relative rounded-lg p-0">
            {/* <DraggableWindow
              id="left-bottom"
              title="AI决策推理"
              layoutBounds="window"
              scale={scale}
            >
              <LeftBottom />
            </DraggableWindow> */}
          </div>
          <div className="flex-1 relative rounded-lg p-0">
            {/* <RightCenter /> */}
            <DraggableWindow
              id="right-center"
              title="漏洞POC"
              layoutBounds="window"
              scale={scale}
            >
              <RightCenter />
            </DraggableWindow>
          </div>
          <div className="flex-1 relative rounded-lg p-0">
            {/* <RightBottom /> */}
            {/* <DraggableWindow
              id="right-bottom"
              title="浏览器自动化"
              layoutBounds="window"
              scale={scale}
            >
              <RightBottom />
            </DraggableWindow> */}
          </div>
        </div>
      </div>
      {/* fixed布局任务栏 -- 最小化的窗口 */}
      <Dock />
    </div>
  );
}

export default CyberPage;
