import axios from "./axiosInstance";

// 获取可用的模型配置项
export function getAvaliableConfig() {
  return axios.get("/api/getAvailableConfig");
}

// 获取当前设置的模型配置信息
export function getCurrentConfig() {
  return axios.get("/api/getCurrentConfig");
}

// 设置模型配置信息
export function setConfig(config: Record<string, any>) {
  return axios.post("/api/setConfig", config);
}
