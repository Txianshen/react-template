import { useState } from "react";

export default function SettingsPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">设置页面</h1>
      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">缓存测试</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">输入一些文字测试缓存:</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="在这里输入文字后切换Tab..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          />
          <p className="text-sm text-muted-foreground">
            当前输入:{" "}
            <strong className="text-[#10b981]">{inputValue || "（空）"}</strong>
          </p>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>👉 测试步骤:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>在上面的输入框中输入一些文字</li>
            <li>切换到其他 Tab (如浏览器自动化)</li>
            <li>再切换回来</li>
            <li>如果输入的文字还在 = 缓存成功！</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
