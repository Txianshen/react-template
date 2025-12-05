import Header from "./components/header";
import LeftTop from "./components/left-top";
import LeftBottom from "./components/left-bottom";
import RightTop from "./components/right-top";
import RightCenter from "./components/right-center";
import RightBottom from "./components/right-bottom";
import Graph from "@/components/graph";

function CyberPage() {
  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center bg-[url('@/assets/icons/cyber/cyber-bg2.svg')]">
      {/* 左中右三列布局 */}
      <div className="grid grid-cols-[1.2fr_3fr_1.2fr] gap-4 min-h-screen">
        {/* 左侧列 - 上下 1:1 布局 */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-0">
            <LeftTop />
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-0">
            <LeftBottom />
          </div>
        </div>

        {/* 中间列 */}
        <div className="p-4 flex flex-col">
          <Header />
          {/* 网络关系拓扑图graph */}
          <div className="flex-1 mt-4">
            <Graph />
          </div>
        </div>

        {/* 右侧列 - 上中下 1:1:1 布局 */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-0">
            <RightTop />
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-0">
            <RightCenter />
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-0">
            <RightBottom />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CyberPage;
