import { useEffect, useState } from "react";
import autofit from "autofit.js";
import Header from "./components/header";
import DraggableWindow from "@/components/window-panel";
// import Graph from "@/components/graph";
import LeftTop from "./components/left-top";

function CyberPage() {
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
  const [activeId, setActiveId] = useState<string | null>(null);
  //   const [minimized, setMinimized] = useState([]);

  //   const minimize = (id) => {
  //     setMinimized((m) => [...m, { id }]);
  //   };

  //   const restore = (id) => {
  //     setMinimized((m) => m.filter((x) => x.id !== id));
  //   };
  return (
    <div
      id="cyber-screen"
      className="h-[1080px] w-[3840px] bg-cover bg-center bg-no-repeat bg-[url('@/assets/icons/cyber/cyber-bg2.svg')]"
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
              layoutBounds="#cyber-screen"
              activeId={activeId}
              setActiveId={setActiveId}
            >
              <LeftTop />
            </DraggableWindow>
          </div>
          <div className="flex-1 relative rounded-lg p-0">
            {/* <LeftBottom /> */}

            <DraggableWindow
              id="left-bottom"
              title="AI决策推理"
              layoutBounds="#cyber-screen"
              activeId={activeId}
              setActiveId={setActiveId}
            />
          </div>
        </div>

        {/* 中间列 */}
        <div className="p-4 flex flex-col">
          <Header />
          {/* 网络关系拓扑图graph */}
          <div className="flex-1 mt-4">{/* <Graph /> */}</div>
        </div>

        {/* 右侧列 - 上中下 1:1:1 布局 */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex-1 relative rounded-lg p-0">
            <DraggableWindow
              id="right-top"
              title="后台终端"
              layoutBounds="#cyber-screen"
              activeId={activeId}
              setActiveId={setActiveId}
            />
          </div>
          <div className="flex-1 relative rounded-lg p-0">
            {/* <RightCenter /> */}
            <DraggableWindow
              id="right-center"
              title="漏洞POC"
              layoutBounds="#cyber-screen"
              activeId={activeId}
              setActiveId={setActiveId}
            />
          </div>
          <div className="flex-1 relative rounded-lg p-0">
            {/* <RightBottom /> */}
            <DraggableWindow
              id="right-bottom"
              title="浏览器自动化"
              layoutBounds="#cyber-screen"
              activeId={activeId}
              setActiveId={setActiveId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CyberPage;
