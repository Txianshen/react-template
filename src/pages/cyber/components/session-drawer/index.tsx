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
import { listSessions, createSession, deleteSession, getSession } from "@/api/cyber";
import { useCyberStore } from "@/store/cyberStore";
import { useStreamingStore } from "@/store/streamingStoreState";
import { Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
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

  const { userId, sessionId, setSessionId } = useCyberStore();

  // 获取会话列表
  useEffect(() => {
    if (open) {
      if (userId) {
        fetchSessions();
      } else {
        toast.error("用户ID未设置");
      }
    }
  }, [open, userId]);

  const fetchSessions = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await listSessions(userId);
      console.log("fetchSessions", response);
      if (response && response.code === 200) {
        // 按时间倒序排列，最新的会话在前面
        const sortedSessions = response.data || [];
        setSessions(sortedSessions);
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
      toast.error("用户ID未设置");
      return;
    }

    try {
      // 生成新的会话ID
      const newSessionId = uuidv4();

      const response = await createSession(userId, newSessionId);
      if (response && response.code === 200) {
        toast.success("会话创建成功");
        // 刷新会话列表
        fetchSessions();
        // 设置新创建的会话为当前会话
        setSessionId(newSessionId);
      } else {
        toast.error(response?.msg || "创建会话失败");
      }
    } catch (error) {
      console.error("创建会话失败:", error);
      //   toast.error("创建会话失败");
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
      const response = await deleteSession(userId, deletingSessionId);
      if (response && response.code === 200) {
        toast.success("会话删除成功");
        // 如果删除的是当前会话，则清空当前会话ID
        if (deletingSessionId === sessionId) {
          setSessionId(null);
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

  // 切换到指定会话
  const handleSwitchSession = async (session: Session) => {
    if (!userId) return;
    if (sessionId === session.id) {
      setOpen(false); // 关闭抽屉
      return
    };
    setSessionId(session.id);
    setOpen(false); // 关闭抽屉

    try {
      // 先清空当前对话
      useStreamingStore.getState().reset();
      
      const response = await getSession(userId, session.id);
      if (response && response.code === 200) {
        // 这里假设后端返回的 session 对象中包含 messages 字段，且格式匹配
        // 如果 response.data 直接是 session 对象
        const messages = response.data?.messages || []; 
        useStreamingStore.getState().setResponses(messages);
        toast.success(`已切换到会话: ${session.id}`);
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
              会话列表
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
                        <div
                          className="flex-1 cursor-pointer min-w-0 "
                        >
                          <div className="truncate text-cyan-100 text-sm">
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
          </div>{" "}
          {/* 这个div闭合了第169行的div */}
          <SheetFooter className="px-4 py-4 border-t border-cyan-400/20">
            <Button
              onClick={handleCreateSession}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-lg"
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
    </>
  );
}
