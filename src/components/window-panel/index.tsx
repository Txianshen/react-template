// ---------------- WindowPanel ----------------
import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import BoxHeader from "@/components/box-wrap/components/boxHeader";

interface WindowPanelProps {
  id: string;
  title: string;
  layoutBounds: string | HTMLElement;
  activeId: string | null;
  setActiveId: (id: string) => void;
  children?: React.ReactNode;
}

export default function WindowPanel({
  id,
  title,
  layoutBounds,
  activeId,
  setActiveId,
  children,
}: WindowPanelProps) {
  // const saved = JSON.parse(localStorage.getItem("win-" + id) || "null");

  const [minimized, setMinimized] = useState(false);
  // const [maximized, setMaximized] = useState(false);

  const [pos, setPos] = useState({
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
    // x: saved?.x ?? 0,
    // y: saved?.y ?? 0,
    // w: saved?.w ?? "100%",
    // h: saved?.h ?? "100%",
  });

  const savePosition = () => {
    // const data = {
    //   x: _d.x,
    //   y: _d.y,
    //   w: _d.width,
    //   h: _d.height,
    // };
    // localStorage.setItem("win-" + id, JSON.stringify(data));
  };
  // const handleMaximize = () => {
  //   if (!maximized) {
  //     setPos({ x: 0, y: 0, w: "100%", h: "100%" });
  //     setMaximized(true);
  //   } else {
  //     setMaximized(false);
  //   }
  // };

  useEffect(() => {
    // if (!maximized && saved) {
    //   setPos({ x: saved.x, y: saved.y, w: saved.w, h: saved.h });
    // }
  }, []);

  return (
    <AnimatePresence>
      {!minimized && (
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Rnd
            style={{ zIndex: activeId === id ? 99 : 1 }}
            onMouseDown={() => setActiveId(id)}
            bounds={layoutBounds}
            dragHandleClassName="window-drag"
            enableResizing
            default={{ x: pos.x, y: pos.y, width: pos.w, height: pos.h }}
            size={{ width: pos.w, height: pos.h }}
            position={{ x: pos.x, y: pos.y }}
            onDragStop={(e, d) => {
              setPos((p) => ({ ...p, x: d.x, y: d.y }));
              savePosition();
            }}
            onResizeStop={(e, dir, ref, delta, newPos) => {
              const w = ref.style.width;
              const h = ref.style.height;
              setPos({ x: newPos.x, y: newPos.y, w, h });
              savePosition();
            }}
            className=" overflow-hidden border border-zinc-700 border border-[#536FA9]/60 relative before:absolute before:top-0 before:left-0 before:w-4 before:h-4 before:border-t-[3px] before:border-l-[3px] before:border-[#00D9FF] after:absolute after:top-0 after:right-0 after:w-4 after:h-4 after:border-t-[3px] after:border-r-[3px] after:border-[#00D9FF]"
          >
            <div className="window-drag cursor-move relative">
              {/* 窗口标题将在此处显示 */}
              <BoxHeader title={title} />
              <button
                onClick={() => setMinimized(true)}
                className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors"
                aria-label="Minimize"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8H13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-[#00D9FF]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-[#00D9FF]" />
            {/* 内容区域应该在这里插入 */}
            <div className="p-4 h-full overflow-auto">
              {/* 窗口内容将在此处渲染 */}
              {children}
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
