import LoadingIcon from "@/assets/icons/loading-icon";

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center">
      {/* Gradio 风格的旋转方块 */}
      <LoadingIcon className="animate-spin" size={64} />
      {/* 加载文本 */}
      <div className="text-[#10b981] text-xs font-medium mt-1 animate-pulse">
        加载中...
      </div>
    </div>
  </div>
);

export default PageLoader;
