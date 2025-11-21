export default function BrowserAutomation() {
  // 从环境变量获取浏览器服务地址
  const steelHost =
    import.meta.env.VITE_STEEL_HOST || "http://47.98.234.82:5173";

  return (
    <div className="w-full h-full">
      <iframe
        src={steelHost}
        className="w-full border-none"
        style={{ height: "850px" }}
        title="浏览器自动化"
      />
    </div>
  );
}
