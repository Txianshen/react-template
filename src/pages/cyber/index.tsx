import { useEffect, useState, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import autofit from "autofit.js";
import { useCurrentSessionConfig, useCyberStore } from "@/store/cyberStore";
import { useStreamingStore } from "@/store/streamingStoreState";
import { listSessions, getSession, createSession } from "@/api/cyber";

const AlternativeLayout = lazy(() => import("./components/alternative-layout"));
const DefaultLayout = lazy(() => import("./components/default-layout"));
import Dock from "@/components/dock";
import SessionManagementDrawer from "./components/session-drawer";
import WorkspaceButton from "./components/workspace-btn";
import TTSMessageDisplay from "@/components/tts-message-display";

function CyberPage() {
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [sessionOpen, setSessionOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const currentSessionConfig = useCurrentSessionConfig();
  const { userId, sessionId, setSessionId, updateSessionConfigs } =
    useCyberStore();

  /**
   * ================================
   * Step 1：真正的「激活会话」
   * ================================
   */
  const activateSession = async (session: any) => {
    if (session.user_id) {
      useCyberStore.getState().setUserId(session.user_id);
    }

    if (session.id) {
      setSessionId(session.id);
    }

    try {
      const detailRes = await getSession(session.id);
      if (detailRes?.code === 200) {
        const messages = detailRes.data?.messages || [];
        useStreamingStore.getState().setResponses(messages, session.id);
      } else {
        console.error("获取会话详情失败:", detailRes?.msg);
      }
    } catch (err) {
      console.error("获取会话详情异常:", err);
    }

    if (session.id && !window.location.pathname.includes(session.id)) {
      navigate(`/cyber/${session.id}`, { replace: true });
    }
  };

  /**
   * ================================
   * Step 2：统一入口
   * list / create / find / activate
   * ================================
   */
  const fetchAndActivateSession = async (target?: {
    id: string;
    user_id?: string;
  }) => {
    try {
      let res = await listSessions();

      // 没有会话 → 创建
      if (!res?.data || res.data.length === 0) {
        const created = await createSession();
        if (!created?.data?.id) {
          toast.error("创建会话失败");
          return;
        }
        res = await listSessions();
      }

      if (!res?.data || res.data.length === 0) return;

      // 更新所有 session config
      const sessionConfigs: any = {};
      res.data.forEach((s: any) => {
        if (s.config) {
          sessionConfigs[s.id] = {
            model_name: s.config.model_name,
            run_mode: s.config.run_mode,
            max_iters: s.config.max_iters,
          };
        }
      });
      updateSessionConfigs(sessionConfigs);

      // 选择要激活的 session
      const session = target
        ? res.data.find((s: any) => s.id === target.id)
        : res.data[0];

      if (!session) {
        toast.error("会话不存在");
        return;
      }

      await activateSession(session);
    } catch (err) {
      console.error("初始化会话失败:", err);
    }
  };

  /**
   * ================================
   * Step 3：useEffect 只负责「来源判断」
   * ================================
   */

  // URL session 优先
  useEffect(() => {
    if (!urlSessionId) return;
    if (urlSessionId === sessionId) return;

    fetchAndActivateSession({ id: urlSessionId, user_id: userId });
  }, [urlSessionId]);

  // 默认初始化
  useEffect(() => {
    if (sessionId) return;
    if (urlSessionId) return;

    fetchAndActivateSession();
  }, [sessionId, urlSessionId]);

  /**
   * ================================
   * autofit & scale（原逻辑不动）
   * ================================
   */
  useEffect(() => {
    autofit.init(
      {
        dh: 1080,
        dw: 3840,
        el: "#cyber-screen",
        resize: true,
      },
      false
    );
    return () => autofit.off();
  }, []);

  useEffect(() => {
    const update = () => {
      const scaleX = window.innerWidth / 3840;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
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
      <WorkspaceButton
        onOpenSessions={() => setSessionOpen(true)}
        isExhibitionMode={currentSessionConfig?.run_mode === "展厅模式"}
      />

      {currentSessionConfig?.run_mode === undefined ? (
        <></>
      ) : currentSessionConfig?.run_mode === "展厅模式" ? (
        <>
          <Suspense fallback={null}>
            <DefaultLayout scale={scale} />
          </Suspense>
          <TTSMessageDisplay />
        </>
      ) : (
        <Suspense fallback={null}>
          <AlternativeLayout scale={scale} />
        </Suspense>
      )}

      <SessionManagementDrawer open={sessionOpen} setOpen={setSessionOpen} />

      <Dock />
    </div>
  );
}

export default CyberPage;
