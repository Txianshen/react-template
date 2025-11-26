import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MODEL_OPTIONS, type ProviderType } from "@/lib/constance";
import WrapBox from "@/pages/home/settingsPage/components/wrapBox";
import { logoutApi } from "@/api/login";

export default function SettingsPage() {
  const navigate = useNavigate();

  // 产品信息（只读）
  const productIntro =
    "本产品是一款基于AI智能体的下一代渗透测试辅助平台，深度整合攻击性安全测试与防御性安全能力，通过智能化Agent技术实现渗透测试全流程赋能。系统搭载多模态神经网络引擎，可自动完成网络空间资产测绘、脆弱性深度挖掘、攻击路径智能推导及漏洞利用链验证，为安全团队提供动态攻击面管理与实战化风险评估解决方案。";
  const mainFunctions =
    "域名探测、端口扫描、服务识别、Web指纹识别、目录扫描、POC验证、弱口令猜解、漏洞扫描、漏洞利用等";
  const auxFunctions = "后渗透辅助、杀软查询、提权辅助、常用命令、代码审计等";

  // 状态管理
  // 对话轮数
  const [turns, setTurns] = useState<number>(50);
  // 模型提供商
  const [provider, setProvider] = useState<ProviderType>("DeepSeek");
  // 选择的模型
  const [selectedModel, setSelectedModel] = useState<string>("deepseek-v3");
  // 自定义模型参数
  // 自定义模型名称
  const [customModelName, setCustomModelName] = useState<string>("ds_v31");
  // 自定义模型API密钥
  const [customApiKey, setCustomApiKey] = useState<string>("");
  // 自定义模型基础URL
  const [customBaseUrl, setCustomBaseUrl] = useState<string>(
    "http://192.168.3.10:8080/v1"
  );
  // 工作模式
  const [mode, setMode] = useState<"Pentest" | "CTF">("Pentest");

  // 处理提供商切换
  const handleProviderChange = (newProvider: ProviderType) => {
    setProvider(newProvider);
    // 切换提供商时重置模型选择
    if (newProvider !== "自定义模型") {
      setSelectedModel("");
    }
  };

  // 应用设置
  const handleApplySettings = () => {
    // TODO: 调用后端API保存配置
    const config = {
      turns,
      provider,
      model: provider === "自定义模型" ? customModelName : selectedModel,
      apiKey: provider === "自定义模型" ? customApiKey : undefined,
      baseUrl: provider === "自定义模型" ? customBaseUrl : undefined,
      mode,
    };

    console.log("应用配置:", config);
    toast.success("全局应用已设置💻");

    // TODO: 实际应该调用 API
    // await axios.post('/api/settings/apply', config);
  };

  // 登出功能
  const handleLogout = async () => {
    try {
      // 调用后端登出接口
      await logoutApi();

      // 清除本地存储的token
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");

      // 显示登出成功提示
      toast.success("已成功登出");

      // 跳转到登录页面
      navigate("/login");
    } catch (error) {
      console.error("登出失败:", error);
      // 即使后端调用失败，也清除本地token并跳转到登录页
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      toast.success("已成功登出");
      navigate("/login");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg border-[#3f3f46] bg-[#27272a]">
        {/* 产品简介 */}
        <WrapBox title="产品简介">
          <Textarea
            value={productIntro}
            readOnly
            className="min-h-[80px]  resize-none bg-muted focus-visible:ring-0 border-none focus-visible:outline-none !bg-[#3f3f46]"
          />
        </WrapBox>

        {/* 主要功能 */}
        <WrapBox title="主要功能">
          <Textarea
            value={mainFunctions}
            readOnly
            className="min-h-[40px] resize-none bg-muted focus-visible:ring-0 border-none focus-visible:outline-none !bg-[#3f3f46]"
          />
        </WrapBox>

        {/* 辅助功能 */}
        <WrapBox title="辅助功能">
          <Textarea
            value={auxFunctions}
            readOnly
            className="min-h-[40px] resize-none bg-muted focus-visible:ring-0 border-none focus-visible:outline-none !bg-[#3f3f46]"
          />
        </WrapBox>

        {/* 最大对话轮数 */}
        <WrapBox title="最大对话轮数" description="请在20到100间选择">
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-muted-foreground">20</span>
            <Slider
              value={[turns]}
              onValueChange={(value) => setTurns(value[0])}
              min={20}
              max={100}
              step={1}
              className="cursor-pointer flex-1 [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500 [&>span:first-child]:bg-white [&_.bg-primary]:bg-emerald-500"
            />
            <span className="text-sm text-muted-foreground">100</span>
          </div>
        </WrapBox>

        {/* 模型提供商 */}
        <WrapBox
          title="模型提供商"
          description="请首先选择您要使用的模型提供商"
        >
          <RadioGroup value={provider} onValueChange={handleProviderChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DeepSeek" id="provider-deepseek" />
              <Label htmlFor="provider-deepseek" className="cursor-pointer">
                DeepSeek
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OpenAI" id="provider-openai" />
              <Label htmlFor="provider-openai" className="cursor-pointer">
                OpenAI
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="通义千问" id="provider-qwen" />
              <Label htmlFor="provider-qwen" className="cursor-pointer">
                通义千问
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="自定义模型" id="provider-custom" />
              <Label htmlFor="provider-custom" className="cursor-pointer">
                自定义模型
              </Label>
            </div>
          </RadioGroup>
        </WrapBox>
      </div>

      {/* 具体模型选择 (非自定义时显示) */}
      {provider !== "自定义模型" && provider in MODEL_OPTIONS && (
        <WrapBox
          title={MODEL_OPTIONS[provider as keyof typeof MODEL_OPTIONS].label}
          description="请选择具体模型"
          className="border border-[#3f3f46] bg-[#27272a]"
        >
          <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
            {MODEL_OPTIONS[provider as keyof typeof MODEL_OPTIONS].choices.map(
              (model) => (
                <div key={model} className="flex items-center space-x-2">
                  <RadioGroupItem value={model} id={`model-${model}`} />
                  <Label htmlFor={`model-${model}`} className="cursor-pointer">
                    {model}
                  </Label>
                </div>
              )
            )}
          </RadioGroup>
        </WrapBox>
      )}

      {/* 自定义模型配置 */}
      {provider === "自定义模型" && (
        <WrapBox className="border border-[#3f3f46] bg-[#27272a]">
          <Accordion type="single" collapsible defaultValue="custom-model">
            <AccordionItem value="custom-model" className="px-0">
              <AccordionTrigger className="py-0 hover:no-underline">
                自定义模型设置
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-model-name">
                    模型名称 (Model Name)
                  </Label>
                  <Input
                    id="custom-model-name"
                    placeholder="例如: gpt-4o-mini"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-api-key">API Key</Label>
                  <Input
                    id="custom-api-key"
                    type="password"
                    placeholder="例如: sk-..."
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-base-url">Base URL</Label>
                  <Input
                    id="custom-base-url"
                    placeholder="留空则使用默认值"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </WrapBox>
      )}

      {/* 工作模式 */}

      <WrapBox
        title="工作模式"
        description="请选择您要使用的综合智能体工作模式"
        className="border border-[#3f3f46] bg-[#27272a]"
      >
        <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as "Pentest" | "CTF")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Pentest" id="mode-pentest" />
            <Label htmlFor="mode-pentest" className="cursor-pointer">
              Pentest
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="CTF" id="mode-ctf" />
            <Label htmlFor="mode-ctf" className="cursor-pointer">
              CTF
            </Label>
          </div>
        </RadioGroup>
      </WrapBox>

      {/* 登出和应用按钮 */}
      <div className="flex gap-4">
        <Button
          onClick={handleLogout}
          className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          size="lg"
        >
          登出
        </Button>
        <Button
          onClick={handleApplySettings}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
          size="lg"
        >
          应用全局设置
        </Button>
      </div>
    </div>
  );
}
