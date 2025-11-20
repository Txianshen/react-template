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

// 模型配置常量
const MODEL_OPTIONS = {
  DeepSeek: {
    label: "DeepSeek 模型",
    choices: ["deepseek-v3", "deepseek-r1"],
  },
  OpenAI: {
    label: "OpenAI 模型",
    choices: [
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4o",
      "chatgpt-4o-latest",
      "gpt-4o-mini",
      "o4-mini",
      "o3-mini",
    ],
  },
  通义千问: {
    label: "千问模型",
    choices: [
      "qwen3-max",
      "qwen3-30b-a3b-thinking-2507",
      "qwen3-30b-a3b-instruct-2507",
      "qwen3-235b-a22b-thinking-2507",
      "qwen3-235b-a22b-instruct-2507",
      "qwen2.5-32b-instruct",
      "qwen2.5-coder-32b-instruct",
      "qwq-32b",
      "qwen3-32b",
      "qwen3-coder-30b-a3b-instruct",
    ],
  },
};

type ProviderType = keyof typeof MODEL_OPTIONS | "自定义模型";

export default function SettingsPage() {
  // 产品信息（只读）
  const productIntro =
    "本产品是一款基于AI智能体的下一代渗透测试辅助平台，深度整合攻击性安全测试与防御性安全能力，通过智能化Agent技术实现渗透测试全流程赋能。系统搭载多模态神经网络引擎，可自动完成网络空间资产测绘、脆弱性深度挖掘、攻击路径智能推导及漏洞利用链验证，为安全团队提供动态攻击面管理与实战化风险评估解决方案。";
  const mainFunctions =
    "域名探测、端口扫描、服务识别、Web指纹识别、目录扫描、POC验证、弱口令猜解、漏洞扫描、漏洞利用等";
  const auxFunctions = "后渗透辅助、杀软查询、提权辅助、常用命令、代码审计等";

  // 状态管理
  const [turns, setTurns] = useState<number>(50);
  const [provider, setProvider] = useState<ProviderType>("DeepSeek");
  const [selectedModel, setSelectedModel] = useState<string>("deepseek-v3");
  const [customModelName, setCustomModelName] = useState<string>("ds_v31");
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [customBaseUrl, setCustomBaseUrl] = useState<string>(
    "http://192.168.3.10:8080/v1"
  );
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

  return (
    <div className="space-y-6 p-6">
      {/* 产品简介 */}
      <div className="space-y-2">
        <Label>产品简介</Label>
        <Textarea
          value={productIntro}
          readOnly
          className="min-h-[100px] resize-none bg-muted"
        />
      </div>

      {/* 主要功能 */}
      <div className="space-y-2">
        <Label>主要功能</Label>
        <Textarea
          value={mainFunctions}
          readOnly
          className="min-h-[60px] resize-none bg-muted"
        />
      </div>

      {/* 辅助功能 */}
      <div className="space-y-2">
        <Label>辅助功能</Label>
        <Textarea
          value={auxFunctions}
          readOnly
          className="min-h-[60px] resize-none bg-muted"
        />
      </div>

      {/* 最大对话轮数 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>最大对话轮数</Label>
          <span className="text-sm font-medium text-primary">{turns}</span>
        </div>
        <p className="text-sm text-muted-foreground">请在20到100间选择</p>
        <Slider
          value={[turns]}
          onValueChange={(value) => setTurns(value[0])}
          min={20}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* 模型提供商 */}
      <div className="space-y-4">
        <Label>模型提供商</Label>
        <p className="text-sm text-muted-foreground">
          请首先选择您要使用的模型提供商
        </p>
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
      </div>

      {/* 具体模型选择 (非自定义时显示) */}
      {provider !== "自定义模型" && provider in MODEL_OPTIONS && (
        <div className="space-y-4">
          <Label>
            {MODEL_OPTIONS[provider as keyof typeof MODEL_OPTIONS].label}
          </Label>
          <p className="text-sm text-muted-foreground">请选择具体模型</p>
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
        </div>
      )}

      {/* 自定义模型配置 */}
      {provider === "自定义模型" && (
        <Accordion type="single" collapsible defaultValue="custom-model">
          <AccordionItem value="custom-model">
            <AccordionTrigger>自定义模型设置</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="custom-model-name">模型名称 (Model Name)</Label>
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
      )}

      {/* 工作模式 */}
      <div className="space-y-4">
        <Label>工作模式</Label>
        <p className="text-sm text-muted-foreground">
          请选择您要使用的综合智能体工作模式
        </p>
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
      </div>

      {/* 应用按钮 */}
      <Button
        onClick={handleApplySettings}
        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
        size="lg"
      >
        应用全局设置
      </Button>
    </div>
  );
}
