import axios from "./axiosInstance";
import type { ApiResponse } from "@/types/api";

// 获取可用的模型配置项
export function getAvaliableConfig() {
  return axios.get("/getAvailableConfig");
}

// 获取当前设置的模型配置信息
export function getCurrentConfig() {
  return axios.get("/getCurrentConfig");
}

// 设置模型配置信息
export function setConfig(config: Record<string, any>) {
  return axios.post("/setConfig", config);
}

// 获取浏览器自动化沙箱url
export function getSandboxUrl(session_id: string) {
  return axios.get(`/getSandboxUrl?session_id=${session_id}`);
}

// 中断ai对话
export function interruptAgent(session_id: string) {
  return axios.post(`/interruptAgent`, { session_id });
}

// 获取网络关系container --/api/getPlaygroundInfo
export function getPlaygroundInfo() {
  return axios.get(`/getPlaygroundInfo`);
}

// 获取漏洞列表
export function getPoc(session_id: string) {
  return axios.get(`/getPoc?session_id=${session_id}`);
}

// session管理
export function listSessions(): Promise<ApiResponse<any>> {
  return axios.get(`/listSessions`);
}

// 获取某个会话详情
export function getSession(session_id: string): Promise<ApiResponse<any>> {
  return axios.get(`/getSession?session_id=${session_id}`);
}

// 创建会话（后端返回session信息，其中id为session_id）
// 返回结构：
// {
//   id: "52e865e5-2a62-41ab-a5ab-5d3b9646320b",  // 这就是session_id
//   messages: [],
//   user_id: "lihaoran1"
// }
export function createSession(): Promise<
  ApiResponse<{ id: string; messages: any[]; user_id: string }>
> {
  return axios.get("/createSession");
}

// 删除会话
export function deleteSession(session_id: string): Promise<ApiResponse<any>> {
  return axios.get(`/deleteSession?session_id=${session_id}`);
}

// 登录接口
// 接口路径/api/auth/login
// 传参： username和 password formdata的形式
export function login(username: string, password: string) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return axios.post("/auth/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 获取使用token信息
// 接口/api/streamTokenUsage
// 返回data数据
// data: {
//   // "total_input_tokens": 14447,
// // "total_output_tokens": 290,
// // "total_tokens": 14737
// }
