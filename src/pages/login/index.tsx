import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { login as apiLogin } from "@/api/cyber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import autofit from "autofit.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 使用autofit.js进行自适应缩放
  useEffect(() => {
    autofit.init({
        dh: 1080, // 设计稿高度
        dw: 3840, // 设计稿宽度
      el: "#login-container", // 登录容器
      resize: true,
    });

    return () => {
      autofit.off(); // 组件卸载时关闭autofit
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      // 调用真实登录接口
      const response = await apiLogin(username, password);
      
      if (response.data) {
        // 获取用户信息
        const userInfo = {
          name: username,
          avatar: response.data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        };
        
        // 使用用户存储的login函数保存登录状态
        login(response.data, userInfo);
        toast.success("登录成功");
        navigate("/cyber");
      } else {
        toast.error("登录失败：未获取到token");
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-container" className="min-h-screen w-full flex items-center justify-center bg-[#0b1220] bg-[url('@/assets/icons/cyber/cyber-bg.svg')] bg-cover bg-center">
      <div  className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl  p-8 md:p-12 lg:p-16 xl:p-20 space-y-8 md:space-y-12 lg:space-y-16 bg-[#0b1220]/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.2)]">
        <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 lg:space-y-8">
          <div className="p-4 md:p-6 lg:p-8 rounded-full bg-cyan-500/10 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <ShieldCheck className="w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 text-cyan-400" />
          </div>
          <h2 className=" text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-cyan-100">
            Matrix
          </h2>
          {/* <p className="text-cyan-400/70 text-lg md:text-xl lg:text-2xl">请输入您的账号密码以继续</p> */}
        </div>

        <form onSubmit={handleLogin} className="space-y-8 md:space-y-12 lg:space-y-16">
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <div className="space-y-4 md:space-y-6">
              <label className="text-xl md:text-2xl font-medium text-cyan-300">
                用户名
              </label>
              <Input
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#0b1220]/50 border-cyan-400/30 text-cyan-100 placeholder:text-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-lg md:text-xl py-6 md:py-8 h-16 md:h-20"
              />
            </div>
            <div className="space-y-4 md:space-y-6">
              <label className="text-xl md:text-2xl font-medium text-cyan-300">密码</label>
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0b1220]/50 border-cyan-400/30 text-cyan-100 placeholder:text-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-lg md:text-xl py-6 md:py-8 h-16 md:h-20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-6 md:py-8 lg:py-10 h-16 md:h-20 lg:h-24 text-lg md:text-xl lg:text-2xl rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300"
          >
            {loading ? "登录中..." : "登录"}
          </Button>
        </form>
      </div>
    </div>
  );
}
