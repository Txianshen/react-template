import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟成功
      const mockToken = "mock-jwt-token-" + Date.now();
      const mockUser = {
        name: username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };

      login(mockToken, mockUser);
      toast.success("登录成功");
      navigate("/cyber");
    } catch (error) {
      toast.error("登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1220] bg-[url('@/assets/icons/cyber/cyber-bg.svg')] bg-cover bg-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#0b1220]/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.2)]">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-cyan-100">
            AI智能攻防平台
          </h2>
          <p className="text-cyan-400/70 text-sm">请输入您的账号密码以继续</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">
                用户名
              </label>
              <Input
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#0b1220]/50 border-cyan-400/30 text-cyan-100 placeholder:text-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">密码</label>
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0b1220]/50 border-cyan-400/30 text-cyan-100 placeholder:text-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300"
          >
            {loading ? "登录中..." : "登 录"}
          </Button>
        </form>
      </div>
    </div>
  );
}
