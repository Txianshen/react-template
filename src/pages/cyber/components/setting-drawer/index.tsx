"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { getAvaliableConfig, getCurrentConfig, setConfig } from "@/api/cyber";

export default function ModelSettingsDrawer({
  open,
  setOpen,
  onConfigSaved, // 可选的配置保存回调
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onConfigSaved?: () => void;
}) {
  // 状态管理
  const [availableConfig, setAvailableConfig] = useState<{
    avail_models: Record<string, string[]>;
    avail_run_modes: string[];
    avail_max_iters: number[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 表单状态
  const [formValues, setFormValues] = useState({
    provider: "",
    model: "",
    mode: "",
    maxIters: 50,
  });

  // 在抽屉打开时获取配置数据
  useEffect(() => {
    if (open) {
      const fetchConfigData = async () => {
        setLoading(true);
        try {
          // 获取可用配置
          const availableResponse = (await getAvaliableConfig()) as {
            data: {
              avail_models: Record<string, string[]>;
              avail_run_modes: string[];
              avail_max_iters: number[];
            };
          };
          setAvailableConfig(availableResponse.data);

          // 获取当前配置
          const currentResponse = (await getCurrentConfig()) as {
            data: {
              model_name: string;
              run_mode: string;
              max_iters: number;
            };
          };
          // 设置表单初始值
          if (currentResponse.data) {
            const {
              model_name: modelName,
              run_mode: runMode,
              max_iters: maxIters,
            } = currentResponse.data;
            // 根据模型名称查找对应的提供商
            let provider = "";
            if (availableResponse.data?.avail_models) {
              const providers = Object.keys(
                availableResponse.data.avail_models
              );
              for (const p of providers) {
                const models = availableResponse.data.avail_models[p] || [];
                if (models.includes(modelName)) {
                  provider = p;
                  break;
                }
              }
            }

            setFormValues({
              provider,
              model: modelName || "",
              mode: runMode || "",
              maxIters: maxIters || 50,
            });
          }
        } catch (error) {
          console.error("获取配置数据失败:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchConfigData();
    }
  }, [open]);

  // 获取模型提供商列表
  const getModelProviders = () => {
    if (!availableConfig || !availableConfig.avail_models) return [];
    return Object.keys(availableConfig.avail_models);
  };

  // 获取指定提供商的模型列表
  const getModelsByProvider = (provider: string) => {
    if (!availableConfig || !availableConfig.avail_models) return [];
    return availableConfig.avail_models[provider] || [];
  };

  // 获取工作模式列表
  const getRunModes = () => {
    if (!availableConfig || !availableConfig["avail_run_modes"]) return [];
    return availableConfig["avail_run_modes"];
  };

  // 获取最大轮数范围
  const getMaxItersRange = () => {
    if (!availableConfig || !availableConfig["avail_max_iters"])
      return [50, 100];
    return availableConfig["avail_max_iters"];
  };

  // 处理表单值变化
  const handleProviderChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      provider: value,
      model: "", // 重置模型选择
    }));
  };

  const handleModelChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      model: value,
    }));
  };

  const handleModeChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      mode: value,
    }));
  };

  const handleMaxItersChange = (value: number[]) => {
    setFormValues((prev) => ({
      ...prev,
      maxIters: value[0],
    }));
  };

  // 保存配置
  const handleSave = async () => {
    setLoading(true);
    try {
      const config = {
        model_name: formValues.model,
        run_mode: formValues.mode,
        max_iters: formValues.maxIters,
      };

      await setConfig(config);
      //   console.log("配置保存成功:", config);
      toast.success("配置保存成功！");

      // 调用保存成功回调（如果提供了的话）
      if (onConfigSaved) {
        onConfigSaved();
      }

      // 关闭抽屉
      setOpen(false);
    } catch (error) {
      console.error("保存配置失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-[380px] bg-[#0b1220]/95 backdrop-blur-xl border-l border-cyan-400/30 text-cyan-100 flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-cyan-300 tracking-wide text-2xl">
            模型设置
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4 flex-1 overflow-y-auto">
          {/* 1. 模型提供商 */}
          <div className="space-y-4">
            <p className="text-sm text-cyan-200 text-xl">模型提供商</p>
            <Select
              value={formValues.provider}
              onValueChange={handleProviderChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-[#0f1a2e] border-cyan-400/20 w-full text-lg">
                <SelectValue placeholder="选择提供商" />
              </SelectTrigger>

              <SelectContent className="bg-[#0f1a2e] border-cyan-400/20 text-cyan-100 text-lg">
                {getModelProviders().map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. 模型 */}
          <div className="space-y-4">
            <p className="text-sm text-cyan-200 text-xl">具体模型</p>
            <Select
              value={formValues.model}
              onValueChange={handleModelChange}
              disabled={loading || !formValues.provider}
            >
              <SelectTrigger className="bg-[#0f1a2e] border-cyan-400/20 w-full text-lg">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>

              <SelectContent className="bg-[#0f1a2e] border-cyan-400/20 text-cyan-100 text-lg">
                {getModelsByProvider(formValues.provider).map(
                  (model: string) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 3. 工作模式 */}
          <div className="space-y-4">
            <p className="text-sm text-cyan-200 text-xl">工作模式</p>
            <Select
              value={formValues.mode}
              onValueChange={handleModeChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-[#0f1a2e] border-cyan-400/20 w-full text-lg">
                <SelectValue placeholder="运行模式" />
              </SelectTrigger>

              <SelectContent className="bg-[#0f1a2e] border-cyan-400/20 text-cyan-100 text-lg">
                {getRunModes().map((mode: string) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. 最大轮数 */}
          <div className="space-y-4">
            <p className="text-sm text-cyan-200 text-xl">最大轮数</p>
            <div className="px-2">
              <Slider
                value={[formValues.maxIters]}
                onValueChange={handleMaxItersChange}
                min={getMaxItersRange()[0]}
                max={getMaxItersRange()[1]}
                step={1}
                disabled={loading}
                className="w-full [&_[data-slot=slider-track]]:bg-[#0f1a2e] [&_[data-slot=slider-track]]:border [&_[data-slot=slider-track]]:border-cyan-400/20 [&_[data-slot=slider-range]]:bg-cyan-500 [&_[data-slot=slider-thumb]]:border-cyan-500 [&_[data-slot=slider-thumb]]:bg-cyan-500 [&_[data-slot=slider-thumb]]:shadow-[0_0_4px_rgba(0,217,255,0.5)]"
              />
              <div className="flex justify-between mt-2  text-lg text-cyan-200">
                <span>{getMaxItersRange()[0]}</span>
                <span>当前值: {formValues.maxIters}</span>
                <span>{getMaxItersRange()[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="px-4 py-4 border-t border-cyan-400/20">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600  text-lg"
          >
            {loading ? "保存中..." : "保存配置"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
