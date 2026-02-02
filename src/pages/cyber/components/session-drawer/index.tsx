import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  listSessions,
  createSession,
  deleteSession,
  getSession,
} from "@/api/cyber";
import { useCyberStore } from "@/store/cyberStore";
import { useStreamingStore } from "@/store/streamingStoreState";
import { Trash2, Settings } from "lucide-react";
import ModelSettingsDrawer from "../setting-drawer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Session {
  id: string;
  user_id: string;
  messages: any[];
  config?: {
    model_name?: string;
    run_mode?: string; // 运行模式：展厅模式、CTF模式、渗透测试模式、护网模式
    max_iters?: number;
  };
  created_at?: string; // 可能的额外字段
  updated_at?: string; // 可能的额外字段
}

export default function SessionManagementDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<{
    model_name?: string;
    run_mode?: string;
    max_iters?: number;
  } | null>(null);
  const [configLoading, setConfigLoading] = useState<boolean>(false);

  const {
    userId,
    sessionId,
    setSessionId,
    updateSessionConfigs,
    setSessionConfig,
    sessionConfigs,
  } = useCyberStore();

  // 获取会话列表
  useEffect(() => {
    if (open) {
      fetchSessions();
      fetchCurrentConfig();
      // if (userId) {
      // } else {
      //   // toast.error("用户ID未设置");
      // }
    }
  }, [open, userId]);

  const fetchSessions = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await listSessions();
      console.log("fetchSessions", response);
      if (response && response.code === 200) {
        // 按时间倒序排列，最新的会话在前面
        const sortedSessions = response.data || [];
        setSessions(sortedSessions);

        // 提取每个会话的配置并存储到 store
        const sessionConfigs: {
          [sessionId: string]: {
            model_name?: string;
            run_mode?: string;
            max_iters?: number;
          };
        } = {};

        sortedSessions.forEach((session: Session) => {
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
      } else {
        toast.error(response?.msg || "获取会话列表失败");
      }
    } catch (error) {
      console.error("获取会话列表失败:", error);
      //   toast.error("获取会话列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 创建新会话
  const handleCreateSession = async () => {
    if (!userId) {
      // toast.error("用户ID未设置");
      return;
    }

    try {
      const response = await createSession();
      if (response && response.code === 200 && response.data?.id) {
        const newSessionId = response.data.id;
        toast.success("会话创建成功");
        // 刷新会话列表
        fetchSessions();
        // 设置新创建的会话为当前会话
        setSessionId(newSessionId);
        // 清空聊天记录
        useStreamingStore.getState().reset();
        useStreamingStore.getState().setResponses([]);
      } else {
        toast.error(response?.msg || "创建会话失败");
      }
    } catch (error) {
      console.error("创建会话失败:", error);
      //   toast.error("创建会话失败");
    }
  };

  // 获取当前配置信息
  const fetchCurrentConfig = async () => {
    setConfigLoading(true);
    try {
      const response = (await import("@/api/cyber").then((module) =>
        module.getCurrentConfig()
      )) as {
        data: {
          model_name?: string;
          run_mode?: string;
          max_iters?: number;
        };
      };
      if (response && response.data) {
        setCurrentConfig(response.data);
      }
    } catch (error) {
      console.error("获取当前配置失败:", error);
    } finally {
      setConfigLoading(false);
    }
  };

  // 准备删除会话
  const prepareDeleteSession = (sessionId: string) => {
    setDeletingSessionId(sessionId);
    setShowDeleteConfirm(true);
  };

  // 删除会话
  const handleDeleteSession = async () => {
    if (!deletingSessionId || !userId) return;

    try {
      const response = await deleteSession(deletingSessionId);
      if (response && response.code === 200) {
        toast.success("会话删除成功");
        // 如果删除的是当前会话，则创建新会话
        if (deletingSessionId === sessionId) {
          const createResponse = await createSession();
          if (
            createResponse &&
            createResponse.code === 200 &&
            createResponse.data?.id
          ) {
            const newSessionId = createResponse.data.id;
            setSessionId(newSessionId);
            useStreamingStore.getState().reset(); // 清空聊天记录
            // 还需要更新下新会话配置
            updateSessionConfigs({
              ...sessionConfigs,
              [newSessionId]: currentConfig || {},
            });
          } else {
            toast.error(createResponse?.msg || "自动创建新会话失败");
            setSessionId(null);
          }
        }
        // 刷新会话列表
        fetchSessions();
      } else {
        toast.error(response?.msg || "删除会话失败");
      }
    } catch (error) {
      console.error("删除会话失败:", error);
      //   toast.error("删除会话失败");
    } finally {
      setShowDeleteConfirm(false);
      setDeletingSessionId(null);
    }
  };

  // 获取运行模式的样式类名
  const getRunModeStyle = (runMode?: string) => {
    if (!runMode) return "";

    const baseStyle =
      "px-2 py-1 text-xs rounded-full font-medium border flex-shrink";

    switch (runMode) {
      case "展厅模式":
        return `${baseStyle} bg-purple-500/20 text-purple-300 border-purple-400/30`;
      case "CTF模式":
        return `${baseStyle} bg-orange-500/20 text-orange-300 border-orange-400/30`;
      case "渗透测试模式":
        return `${baseStyle} bg-red-500/20 text-red-300 border-red-400/30`;
      case "护网模式":
        return `${baseStyle} bg-blue-500/20 text-blue-300 border-blue-400/30`;
      default:
        return `${baseStyle} bg-gray-500/20 text-gray-300 border-gray-400/30`;
    }
  };

  // 切换到指定会话
  const handleSwitchSession = async (session: Session) => {
    if (!userId) return;
    if (sessionId === session.id) {
      setOpen(false); // 关闭抽屉
      return;
    }
    setSessionId(session.id);
    // 设置当前会话的配置
    if (session.config) {
      setSessionConfig(session.id, session.config);
    }
    setOpen(false); // 关闭抽屉

    try {
      // 先清空当前对话
      useStreamingStore.getState().reset();

      const response = await getSession(session.id);
      if (response && response.code === 200) {
        // 这里假设后端返回的 session 对象中包含 messages 字段，且格式匹配
        // 如果 response.data 直接是 session 对象
        const messages = response.data?.messages || [];
        useStreamingStore.getState().setResponses(messages, session.id);
        toast.success(
          `已切换到会话: ${session.id}${session.config?.run_mode ? ` (${session.config.run_mode})` : ""}`
        );
      } else {
        toast.error(response?.msg || "获取会话详情失败");
      }
    } catch (error) {
      console.error("切换会话失败:", error);
      // toast.error("切换会话失败");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[380px] bg-[#0b1220]/95 backdrop-blur-xl border-l border-cyan-400/30 text-cyan-100 flex flex-col"
        >
          <SheetHeader>
            <SheetTitle className="text-cyan-300 tracking-wide text-2xl">
              会话历史
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* 会话列表 */}
            <div className=" flex-1 overflow-y-auto px-4">
              <div className="">
                {loading ? (
                  <div className="text-center text-cyan-300 py-4">
                    加载中...
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center text-cyan-300 py-4">暂无会话</div>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => handleSwitchSession(session)}
                        className={`cursor-pointer flex items-center justify-between p-3 rounded-lg border border-cyan-400/30 transition-colors group relative ${
                          session.id === sessionId
                            ? "bg-[#0f1a2e] border-cyan-400/60"
                            : "hover:bg-[#0f1a2e]"
                        }`}
                      >
                        <div className="flex-1 cursor-pointer min-w-0 flex items-center gap-2">
                          {session.config?.run_mode && (
                            <span
                              className={getRunModeStyle(
                                session.config.run_mode
                              )}
                            >
                              {session.config.run_mode}
                            </span>
                          )}
                          <div className="flex-1 truncate text-cyan-100 text-sm mr-8">
                            {session.id}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/30 ml-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={(e) => {
                            e.stopPropagation();
                            prepareDeleteSession(session.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 这个div闭合了第169行的div */}
          <SheetFooter className="px-4 py-4 border-t border-cyan-400/20 space-y-3">
            {/* 当前配置状态栏 */}
            <div
              className="bg-[#0f1a2e] border border-cyan-400/20 rounded-lg p-3 cursor-pointer hover:bg-[#132238] transition-colors"
              onClick={() => setShowSettings(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-cyan-300 mb-1">当前配置</div>
                  {configLoading ? (
                    <div className="text-cyan-200 text-xs">加载中...</div>
                  ) : currentConfig ? (
                    <div className="space-y-1">
                      {/* 全局配置 */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-cyan-200 text-xs">全局:</span>
                        <span className="text-cyan-100 text-sm font-medium truncate">
                          {currentConfig.model_name || "未设置模型"}
                        </span>
                        {currentConfig.run_mode && (
                          <span
                            className={getRunModeStyle(currentConfig.run_mode)}
                          >
                            {currentConfig.run_mode}
                          </span>
                        )}
                        {currentConfig.max_iters && (
                          <span className="text-cyan-400 text-xs">
                            轮数:{currentConfig.max_iters}
                          </span>
                        )}
                      </div>
                      {/* 当前会话配置 */}
                      {sessionId && sessionConfigs[sessionId] && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-cyan-200 text-xs">会话:</span>
                          <span className="text-cyan-100 text-sm font-medium truncate">
                            {sessionConfigs[sessionId].model_name ||
                              "未设置模型"}
                          </span>
                          {sessionConfigs[sessionId].run_mode && (
                            <span
                              className={getRunModeStyle(
                                sessionConfigs[sessionId].run_mode
                              )}
                            >
                              {sessionConfigs[sessionId].run_mode}
                            </span>
                          )}
                          {sessionConfigs[sessionId].max_iters && (
                            <span className="text-purple-400 text-xs">
                              轮数:{sessionConfigs[sessionId].max_iters}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-cyan-400 text-xs">暂无配置信息</div>
                  )}
                </div>
                <Settings className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              </div>
            </div>

            {/* 新增会话按钮 */}
            <Button
              onClick={handleCreateSession}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-lg py-3"
            >
              新增会话
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 删除确认对话框 */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-[#0b1220]  border-cyan-400/30 text-cyan-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-300 text-2xl">
              确认删除
            </DialogTitle>
            <DialogDescription className="text-cyan-200 text-lg">
              确定要删除此会话吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="panelGhost"
              onClick={() => setShowDeleteConfirm(false)}
            >
              取消
            </Button>
            <Button variant="panelDanger" onClick={handleDeleteSession}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 模型设置抽屉 */}
      <ModelSettingsDrawer
        open={showSettings}
        setOpen={(isOpen) => {
          setShowSettings(isOpen);
          // 注意：只有当设置真正保存成功后，才需要刷新配置
          // 这里不主动刷新，避免不必要的API调用
        }}
        onConfigSaved={() => {
          // 只有在配置真正保存成功时才刷新显示
          fetchCurrentConfig();
        }}
      />
    </>
  );
}
