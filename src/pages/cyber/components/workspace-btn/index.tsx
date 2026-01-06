import {
  LayoutGrid,
  Settings,
  MessageSquare,
  User,
  LogOut,
  UserPen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function WorkspaceButton({
  onOpenSettings,
  onOpenSessions,
}: {
  onOpenSettings: () => void;
  onOpenSessions: () => void;
}) {
  const navigate = useNavigate();
  const { userInfo, logout, updateProfile } = useUserStore();
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editName, setEditName] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("已退出登录");
  };

  const handleOpenEdit = () => {
    setEditName(userInfo?.name || "");
    setShowProfileEdit(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error("用户名不能为空");
      return;
    }
    updateProfile({ name: editName });
    toast.success("用户信息更新成功");
    setShowProfileEdit(false);
  };

  return (
    <>
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger asChild>
          <button
            className={cn(
              "fixed top-6 right-20 z-[100] px-3 py-3 rounded-full flex items-center justify-center gap-2",
              "border border-cyan-400/60 text-cyan-300 backdrop-blur-md",
              "shadow-[0_0_12px_rgba(0,255,255,0.6)]",
              "animate-glowPulse",
              "bg-[#0b1220]/80 hover:bg-[#0b1220]/90 transition-all"
            )}
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="bottom"
          align="end"
          className="w-56 bg-[#0b1220]/95 backdrop-blur-xl border border-cyan-400/30 p-2"
        >
          <div className="flex flex-col gap-1">
            {/* 功能区 */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-cyan-100 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>模型设置</span>
            </button>
            <button
              onClick={onOpenSessions}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-cyan-100 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>会话历史</span>
            </button>

            {/* 分割线 */}
            <div className="h-px bg-cyan-400/20 my-1" />

            {/* 用户区 */}
            <div className="px-3 py-2 flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full border border-cyan-400/50 overflow-hidden bg-cyan-900/20 flex items-center justify-center">
                {userInfo?.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-cyan-100 truncate">
                  {userInfo?.name || "未登录"}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-cyan-100 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors"
            >
              <UserPen className="w-4 h-4" />
              <span>编辑信息</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* 编辑用户信息弹窗 */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent className="bg-[#0b1220]/95 border-cyan-400/30 text-cyan-100">
          <DialogHeader>
            <DialogTitle className="text-cyan-300">编辑用户信息</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">
                用户名
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-[#0b1220]/50 border-cyan-400/30 text-cyan-100 focus:border-cyan-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProfileEdit(false)}
              className="border-cyan-400/30 text-cyan-300 hover:bg-cyan-900/20 hover:text-cyan-100"
            >
              取消
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 动画 keyframes */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(0,255,255,0.6); }
          50% { box-shadow: 0 0 20px rgba(0,255,255,1); }
        }
        .animate-glowPulse { animation: glowPulse 2.4s infinite ease-in-out; }
      `}</style>
    </>
  );
}
