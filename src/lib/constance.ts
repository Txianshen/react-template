// 模型配置常量
export const MODEL_OPTIONS = {
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
} as const;

// 模型提供商类型
export type ProviderType = keyof typeof MODEL_OPTIONS | "自定义模型";
