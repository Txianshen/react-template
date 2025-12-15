// ---------------- WindowPanel ----------------
import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { Minus } from "lucide-react";
import BoxHeader from "@/components/box-wrap/components/boxHeader";
import { useWindowStore } from "@/store/windowStore";
import { cn } from "@/lib/utils";

interface WindowPanelProps {
  id: string;
  title: string;
  layoutBounds: string | HTMLElement;
  showHeader?: boolean; // 控制是否显示头部
  headerComponent?: React.ReactNode; // 允许传入自定义头部组件
  children?: React.ReactNode;
  className?: string;
  scale?: number;
}

export default function WindowPanel({
  id,
  title,
  layoutBounds,
  showHeader = true, // 默认显示头部
  headerComponent, // 自定义头部组件
  children,
  className,
  scale,
}: WindowPanelProps) {
  // const saved = JSON.parse(localStorage.getItem("win-" + id) || "null");
  console.log("scale", scale);
  const [RndScale, setRndScale] = useState(scale);

  useEffect(() => {
    console.log("scale", scale);
    if (scale) {
      setRndScale(scale);
    }
  }, [scale]);
  const { activeId, setActiveId, minimizeWindow } = useWindowStore();
  const windowState = useWindowStore((state) => state.windows[id]);
  const isMinimized = windowState ? windowState.minimized : false;

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

  // 处理最小化逻辑
  const handleMinimize = () => {
    minimizeWindow(id);
  };

  useEffect(() => {
    // if (!maximized && saved) {
    //   setPos({ x: saved.x, y: saved.y, w: saved.w, h: saved.h });
    // }
  }, []);

  useEffect(() => {
    // 注册窗口
    useWindowStore.getState().registerWindow(id, title);

    // 组件卸载时注销窗口
    return () => {
      useWindowStore.getState().unregisterWindow(id);
    };
  }, [id, title]);

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          className="w-full h-full "
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Rnd
            style={{ zIndex: activeId === id ? 99 : 1 }}
            onMouseDown={() => setActiveId(id)}
            bounds={layoutBounds}
            dragHandleClassName="window-drag"
            scale={RndScale}
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
            className={cn(
              "bg-[#0e1e3bfa] overflow-hidden !flex flex-col border border-zinc-700 border border-[#536FA9]/60 relative before:absolute before:top-0 before:left-0 before:w-4 before:h-4 before:border-t-[3px] before:border-l-[3px] before:border-[#00D9FF] after:absolute after:top-0 after:right-0 after:w-4 after:h-4 after:border-t-[3px] after:border-r-[3px] after:border-[#00D9FF]",
              className
            )}
          >
            <div className="window-drag cursor-move relative">
              {/* 窗口标题将在此处显示 */}
              {showHeader && (
                <>
                  {headerComponent ? (
                    headerComponent
                  ) : (
                    <BoxHeader title={title} />
                  )}
                </>
              )}
              <button
                onClick={(e) => {
                  console.log("Minimizing window:", id);
                  e.stopPropagation();
                  handleMinimize();
                }}
                onMouseDown={(e) => {
                  console.log("Minimizing window:", id);
                  e.stopPropagation();
                }}
                className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors "
                aria-label="Minimize"
              >
                <Minus size={32} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-[#00D9FF]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-[#00D9FF]" />
            {/* 内容区域应该在这里插入 */}
            <div className=" p-4 flex-1 overflow-auto">
              {/* 窗口内容将在此处渲染 */}
              {children}
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
