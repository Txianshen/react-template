import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { listSessions, getSession, createSession } from "@/api/cyber";
import { useCyberStore } from "@/store/cyberStore";
import { useStreamingStore } from "@/store/streamingStoreState";

/**
 * 会话启动 Hook
 * - URL / 默认 / 创建
 * - session 激活
 * - 副作用集中管理
 */
export function useSessionBootstrap() {
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { sessionId, setUserId, setSessionId, updateSessionConfigs } =
    useCyberStore();

  // 防止 React StrictMode / 重复执行
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * =========================
   * 总入口
   * =========================
   */
  const bootstrap = async () => {
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

      // 1️⃣ 更新所有 session configs
      const sessionConfigs: Record<string, any> = {};
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

      // 2️⃣ 选择要激活的 session
      const targetSession = urlSessionId
        ? res.data.find((s: any) => s.id === urlSessionId)
        : res.data[0];

      if (!targetSession) {
        toast.error("会话不存在");
        return;
      }

      await activateSession(targetSession);
    } catch (err) {
      console.error("会话初始化失败:", err);
    }
  };

  /**
   * =========================
   * 真正的激活逻辑
   * =========================
   */
  const activateSession = async (session: any) => {
    // userId
    if (session.user_id) {
      setUserId(session.user_id);
    }

    // sessionId
    if (session.id !== sessionId) {
      setSessionId(session.id);
    }

    // 拉消息
    try {
      const detailRes = await getSession(session.id);
      if (detailRes?.code === 200) {
        const messages = detailRes.data?.messages || [];
        useStreamingStore.getState().setResponses(messages, session.id);
      }
    } catch (err) {
      console.error("获取会话详情失败:", err);
    }

    // 路由同步
    if (!window.location.pathname.includes(session.id)) {
      navigate(`/cyber/${session.id}`, { replace: true });
    }
  };
}
