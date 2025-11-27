import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { type ProviderType, PRODUCT_INFO } from "@/lib/constance";
import WrapBox from "@/pages/home/settingsPage/components/wrapBox";
import StyledRadioItem from "@/pages/home/settingsPage/components/StyledRadioItem";
import { logoutApi } from "@/api/login";
// import { agentsAPI } from "@/api/agents";

export default function SettingsPage() {
  const navigate = useNavigate();

  // 状态管理
  // 动态模型选项（从后端获取）
  const [dynamicModelOptions, setDynamicModelOptions] = useState<
    Record<string, { label: string; choices: string[] }>
  >({});
  // 对话轮数
  const [turns, setTurns] = useState<number>(50);

  // 重置对话轮数为默认值
  const handleResetTurns = () => {
    setTurns(50);
  };

  // 处理数字输入框变化
  const handleTurnsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleTurnsInputChange", e.target.value);
    const value = e.target.value;
    if (value === "") {
      setTurns(50);
      return;
    }
    const numValue = parseInt(value, 10);
    console.log("numValue", numValue);
    // 只要是有效数字就更新,自动限制在范围内
    if (!isNaN(numValue)) {
      setTurns(numValue);
    }
  };

  // 处理输入框失去焦点时的验证
  const handleTurnsBlur = () => {
    // 如果当前值为空或无效,恢复为默认值50
    if (!turns || turns < 20) {
      setTurns(20);
    }
    if (turns > 100) {
      setTurns(100);
    }
  };
  // 模型提供商
  const [provider, setProvider] = useState<ProviderType>("");
  // 选择的模型
  const [selectedModel, setSelectedModel] = useState<string>("");
  // 自定义模型参数(使用组件本地 state,每次进入页面时从后端获取最新值)
  const [customModelConfig, setCustomModelConfig] = useState<{
    model_name: string;
    api_key: string;
    base_url: string;
  }>({
    model_name: "",
    api_key: "",
    base_url: "",
  });
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
      model:
        provider === "自定义模型"
          ? customModelConfig.model_name
          : selectedModel,
      apiKey: provider === "自定义模型" ? customModelConfig.api_key : undefined,
      baseUrl:
        provider === "自定义模型" ? customModelConfig.base_url : undefined,
      mode,
    };

    console.log("应用配置:", config);
    toast.success("全局应用已设置💻");

    // TODO: 实际应该调用 API
    // await axios.post('/api/settings/apply', config);
  };

  // 在组件挂载时获取最新的模型列表
  useEffect(() => {
    const fetchModels = async () => {
      // const response = await agentsAPI.getModels();
      // 设置假数据
      const response = {
        data: {
          providers: {
            DeepSeek: ["deepseek-chat", "deepseek-reasoner"],
            OpenAI: [
              "gpt-4.1",
              "gpt-4.1-mini",
              "gpt-4o",
              "chatgpt-4o-latest",
              "gpt-4o-mini",
              "o4-mini",
              "o3-mini",
            ],
            通义千问: [
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
          custom_model_template: {
            models: "自定义模型",
            model_name: "",
            api_key: "",
            base_url: "",
          },
        },
      };

      // 转换后端返回的数据格式为前端需要的格式
      const dynamicOptions: Record<
        string,
        { label: string; choices: string[] }
      > = {};

      // 遍历提供商数据
      Object.entries(response.data.providers).forEach(([provider, models]) => {
        // 根据提供商名称设置标签
        let label = provider;
        if (provider === "DeepSeek") {
          label = "DeepSeek 模型";
        } else if (provider === "OpenAI") {
          label = "OpenAI 模型";
        } else if (provider === "通义千问") {
          label = "千问模型";
        }

        dynamicOptions[provider] = {
          label,
          choices: models,
        };
      });

      // 提取自定义模型模板
      const customTemplate = response.data.custom_model_template;

      // 更新组件本地的 state
      setDynamicModelOptions(dynamicOptions);
      setCustomModelConfig({
        model_name: customTemplate.model_name,
        api_key: customTemplate.api_key,
        base_url: customTemplate.base_url,
      });
    };

    fetchModels();
  }, []); // 空依赖数组,仅在组件首次挂载时执行

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
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg border-[#3f3f46] bg-[#27272a]">
        {/* 产品简介 */}
        <WrapBox title="产品简介">
          <Textarea
            value={PRODUCT_INFO.intro}
            readOnly
            className="min-h-[80px]  resize-none bg-muted focus-visible:ring-0 border-none focus-visible:outline-none !bg-[#3f3f46]"
          />
        </WrapBox>

        {/* 主要功能 */}
        <WrapBox title="主要功能">
          <Textarea
            value={PRODUCT_INFO.mainFunctions}
            readOnly
            className="min-h-[40px] resize-none bg-muted focus-visible:ring-0 border-none focus-visible:outline-none !bg-[#3f3f46]"
          />
        </WrapBox>

        {/* 辅助功能 */}
        <WrapBox title="辅助功能">
          <Textarea
            value={PRODUCT_INFO.auxFunctions}
            readOnly
            className="min-h-[40px] resize-none bg-muted focus-visible:ring-0 border-none focus-visible:outline-none !bg-[#3f3f46]"
          />
        </WrapBox>

        {/* 最大对话轮数 */}
        <WrapBox
          title="最大对话轮数"
          description="请在20到100间选择"
          titleExtra={
            <>
              <Input
                type="number"
                min={20}
                max={100}
                value={turns}
                onChange={handleTurnsInputChange}
                onBlur={handleTurnsBlur}
                className="w-16 h-8 text-center text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleResetTurns}
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          }
        >
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
          <RadioGroup
            value={provider}
            onValueChange={handleProviderChange}
            className="flex"
          >
            {Object.keys(dynamicModelOptions).map((providerKey) => (
              <StyledRadioItem
                key={providerKey}
                value={providerKey}
                id={`provider-${providerKey}`}
                label={providerKey}
                isSelected={provider === providerKey}
              />
            ))}
            <StyledRadioItem
              value="自定义模型"
              id="provider-custom"
              label="自定义模型"
              isSelected={provider === "自定义模型"}
            />
          </RadioGroup>
        </WrapBox>
      </div>

      {/* 具体模型选择 (非自定义时显示) */}
      {provider !== "自定义模型" && provider in dynamicModelOptions && (
        <WrapBox
          title={dynamicModelOptions[provider].label}
          description="请选择具体模型"
          className="border border-[#3f3f46] bg-[#27272a]"
        >
          <RadioGroup
            value={selectedModel}
            onValueChange={setSelectedModel}
            className="flex flex-wrap"
          >
            {dynamicModelOptions[provider].choices.map((model) => (
              <StyledRadioItem
                key={model}
                value={model}
                id={`model-${model}`}
                label={model}
                isSelected={selectedModel === model}
              />
            ))}
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
              <AccordionContent className="space-y-4 pt-4 pb-0">
                <div className="space-y-2">
                  <Label htmlFor="custom-model-name">
                    模型名称 (Model Name)
                  </Label>
                  <Input
                    id="custom-model-name"
                    placeholder="例如: gpt-4o-mini"
                    value={customModelConfig.model_name}
                    onChange={(e) =>
                      setCustomModelConfig((prev) => ({
                        ...prev,
                        model_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-api-key">API Key</Label>
                  <Input
                    id="custom-api-key"
                    type="password"
                    placeholder="例如: sk-..."
                    value={customModelConfig.api_key}
                    onChange={(e) =>
                      setCustomModelConfig((prev) => ({
                        ...prev,
                        api_key: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-base-url">Base URL</Label>
                  <Input
                    id="custom-base-url"
                    placeholder="留空则使用默认值"
                    value={customModelConfig.base_url}
                    onChange={(e) =>
                      setCustomModelConfig((prev) => ({
                        ...prev,
                        base_url: e.target.value,
                      }))
                    }
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
          className="flex"
        >
          <StyledRadioItem
            value="Pentest"
            id="mode-pentest"
            label="Pentest"
            isSelected={mode === "Pentest"}
          />
          <StyledRadioItem
            value="CTF"
            id="mode-ctf"
            label="CTF"
            isSelected={mode === "CTF"}
          />
        </RadioGroup>
      </WrapBox>

      {/* 登出和应用按钮 */}
      <div className="flex gap-4">
        <Button
          onClick={handleLogout}
          className="text-white flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          size="lg"
        >
          登出
        </Button>
        <Button
          onClick={handleApplySettings}
          className="text-white flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
          size="lg"
        >
          应用全局设置
        </Button>
      </div>
    </div>
  );
}
