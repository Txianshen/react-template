import { useWindowStore } from "@/store/windowStore";
// import { useState } from "react";

export default function Dock() {
  const windows = useWindowStore((state) => state.windows);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);

  const minimized = Object.values(windows).filter((w) => w.minimized);

  return (
    minimized &&
    minimized.length > 0 && (
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-zinc-900/80 backdrop-blur px-4 py-2 rounded-xl border border-zinc-700 z-100000">
        {minimized.map((win) => (
          <button
            key={win.id}
            onClick={() => restoreWindow(win.id)}
            className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600 text-white text-sm"
          >
            {win.title}
          </button>
        ))}
      </div>
    )
  );
}
