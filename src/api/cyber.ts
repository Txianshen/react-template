import axios from "./axiosInstance";

// 模拟数据标志 - 设置为true以使用模拟数据
const USE_MOCK_DATA = true;

// 模拟数据
const MOCK_AVAILABLE_CONFIG = {
  avail_models: {
    qwen: [
      "qwen3-max",
      "qwen-plus",
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
  avail_run_modes: ["pentest", "ctf", "mass"],
  "avail max iters": [50, 100],
};

const MOCK_CURRENT_CONFIG = {
  "model name": "qwen3-max",
  "run mode": "ctf",
  "max iters": 31,
};

// 获取可用的模型配置项
export function getAvaliableConfig() {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: MOCK_AVAILABLE_CONFIG }); // 保持axios响应格式
      }, 500); // 模拟网络延迟
    });
  }
  return axios.get("/api/getAvaliableConfig");
}

// 获取当前设置的模型配置信息
export function getCurrentConfig() {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: MOCK_CURRENT_CONFIG }); // 保持axios响应格式
      }, 500); // 模拟网络延迟
    });
  }
  return axios.get("/api/getConfig");
}

// 设置模型配置信息
export function setConfig(config: Record<string, any>) {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("模拟保存配置:", config);
        resolve({ data: { success: true } });
      }, 500); // 模拟网络延迟
    });
  }
  return axios.post("/api/setConfig", config);
}
