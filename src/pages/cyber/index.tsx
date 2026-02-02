import { useEffect, useState, Suspense, lazy } from "react";
import autofit from "autofit.js";
import { useCurrentSessionConfig, useCyberStore } from "@/store/cyberStore";
import { useStreamingStore } from "@/store/streamingStoreState";
import { listSessions, getSession, createSession } from "@/api/cyber";
const AlternativeLayout = lazy(() => import("./components/alternative-layout"));
const DefaultLayout = lazy(() => import("./components/default-layout"));
import Dock from "@/components/dock";
// import ModelSettingsDrawer from "./components/setting-drawer";
import SessionManagementDrawer from "./components/session-drawer";
import WorkspaceButton from "./components/workspace-btn";
import TTSMessageDisplay from "@/components/tts-message-display";
// import PageLoader from "@/components/page-loader";

function CyberPage() {
  // const [open, setOpen] = useState(false);

  // 加载会话详情的公共函数
  const loadSessionDetails = async (session: any) => {
    // 从会话信息中获取并设置用户ID
    if (session.user_id) {
      useCyberStore.getState().setUserId(session.user_id);
    }
    console.log("使用现有会话:", session.id);

    // 获取会话详情
    try {
      const sessionDetailResponse = await getSession(session.id);
      if (sessionDetailResponse && sessionDetailResponse.code === 200) {
        const messages = sessionDetailResponse.data?.messages || [];
        useStreamingStore.getState().setResponses(messages, session.id);
        console.log("已加载会话消息:", messages.length, "条");
      } else {
        console.error("获取会话详情失败:", sessionDetailResponse?.msg);
      }
    } catch (detailError) {
      console.error("获取会话详情异常:", detailError);
    }
  };

  // 更新会话配置的公共函数
  const updateSessionConfigurations = (sessions: any[]) => {
    const sessionConfigs: {
      [sessionId: string]: {
        model_name?: string;
        run_mode?: string;
        max_iters?: number;
      };
    } = {};

    sessions.forEach((session: any) => {
      if (session.config) {
        // 将会话中的 config 映射到期望的格式
        sessionConfigs[session.id] = {
          model_name: session.config.model_name,
          run_mode: session.config.run_mode,
          max_iters: session.config.max_iters,
        };
      }
    });

    updateSessionConfigs(sessionConfigs);
  };
  const [sessionOpen, setSessionOpen] = useState(false);
  const currentSessionConfig = useCurrentSessionConfig();
  console.log("currentSessionConfig", currentSessionConfig);

  // 从 store 获取会话相关状态和方法
  const { sessionId, setSessionId, updateSessionConfigs } = useCyberStore();

  // 初始化会话的逻辑
  useEffect(() => {
    const initSession = async () => {
      // 检查是否已经初始化过，避免重复初始化
      if (sessionId) return;

      try {
        // 首先尝试获取现有会话列表
        const response = await listSessions();

        if (
          response &&
          response.code === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          // 如果存在会话，使用第一个会话的信息
          const firstSession = response.data[0];
          setSessionId(firstSession.id);

          // 使用公共函数更新会话配置
          updateSessionConfigurations(response.data);

          // 使用公共函数加载会话详情
          await loadSessionDetails(firstSession);
        } else {
          // 如果没有现有会话，创建新会话
          const createResponse = await createSession();
          if (
            createResponse &&
            createResponse.code === 200 &&
            createResponse.data?.id
          ) {
            setSessionId(createResponse.data.id);
            console.log("创建新会话:", createResponse.data.id);
            const newResponse = await listSessions();
            if (
              newResponse &&
              newResponse.code === 200 &&
              newResponse.data &&
              newResponse.data.length > 0
            ) {
              const firstSession = newResponse.data[0];
              setSessionId(firstSession.id);

              // 使用公共函数更新会话配置
              updateSessionConfigurations(newResponse.data);

              // 使用公共函数加载会话详情
              await loadSessionDetails(firstSession);
            }
          } else {
            console.error("创建会话失败:", createResponse?.msg);
          }
        }
      } catch (error) {
        console.error("Error initializing session on init:", error);

        // 如果获取会话列表失败，尝试创建新会话
        // try {
        //   const createResponse = await createSession();
        //   if (
        //     createResponse &&
        //     createResponse.code === 200 &&
        //     createResponse.data?.id
        //   ) {
        //     setSessionId(createResponse.data.id);
        //     console.log("创建新会话:", createResponse.data.id);

        //     // 对于新创建的会话，获取会话详情并更新配置
        //     try {
        //       const newSessionDetailResponse = await getSession(
        //         createResponse.data.id
        //       );
        //       if (
        //         newSessionDetailResponse &&
        //         newSessionDetailResponse.code === 200
        //       ) {
        //         // 更新会话配置
        //         if (newSessionDetailResponse.data) {
        //           updateSessionConfigurations([newSessionDetailResponse.data]);
        //         }

        //         // 加载会话详情
        //         await loadSessionDetails(newSessionDetailResponse.data);
        //       }
        //     } catch (detailError) {
        //       console.error("获取新创建会话详情异常:", detailError);
        //     }
        //   } else {
        //     console.error("创建会话失败:", createResponse?.msg);
        //   }
        // } catch (createError) {
        //   console.error("Error creating session:", createError);
        // }
      }
    };

    initSession();
  }, [sessionId]); // 只有在 sessionId 未设置时才初始化
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
      <WorkspaceButton
        onOpenSessions={() => setSessionOpen(true)}
        isExhibitionMode={currentSessionConfig?.run_mode === "展厅模式"}
      />
      {/* 根据运行模式决定布局 */}
      {currentSessionConfig?.run_mode === undefined ? (
        // <PageLoader />
        <></>
      ) : currentSessionConfig?.run_mode === "展厅模式" ? (
        <>
          {/* 展厅模式：使用默认布局  */}
          <Suspense fallback={null}>
            <DefaultLayout scale={scale} />
          </Suspense>
          {/* TTS消息显示 */}
          <TTSMessageDisplay />
        </>
      ) : (
        /* 非展厅模式：左右两列布局 */
        <Suspense fallback={null}>
          <AlternativeLayout scale={scale} />
        </Suspense>
      )}
      {/* <ModelSettingsDrawer open={open} setOpen={setOpen} /> */}
      <SessionManagementDrawer open={sessionOpen} setOpen={setSessionOpen} />

      {/* fixed布局任务栏 -- 最小化的窗口 */}
      <Dock />
    </div>
  );
}

export default CyberPage;
