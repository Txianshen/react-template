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

// // 获取AI决策推理结果
// export function getCurrentPlan(user_id: string, session_id: string) {
//   return axios.get(
//     `/getCurrentPlan?user_id=${user_id}&session_id=${session_id}`
//   );
// }

// 获取浏览器自动化沙箱url
export function getSandboxUrl(user_id: string, session_id: string) {
  return axios.get(
    `/getSandboxUrl?user_id=${user_id}&session_id=${session_id}`
  );
}

// 中断ai对话
export function interruptAgent(user_id: string, session_id: string) {
  return axios.post(`/interruptAgent`, { user_id, session_id });
}

// 获取网络关系container --/api/getPlaygroundInfo
export function getPlaygroundInfo() {
  return axios.get(`/getPlaygroundInfo`);
}

// 获取漏洞列表
export function getPoc(user_id: string, session_id: string) {
  return axios.get(`/getPoc?user_id=${user_id}&session_id=${session_id}`);
}

// session管理
export function listSessions(user_id: string): Promise<ApiResponse<any>> {
  return axios.get(`/listSessions?user_id=${user_id}`);
}

// 获取某个会话详情
export function getSession(user_id: string, session_id: string) {
  return axios.get(`/getSession?user_id=${user_id}&session_id=${session_id}`);
}

// 创建会话
export function createSession(
  user_id: string,
  session_id: string
): Promise<ApiResponse<any>> {
  return axios.get(
    `/createSession?user_id=${user_id}&session_id=${session_id}`
  );
}

// 删除会话
export function deleteSession(
  user_id: string,
  session_id: string
): Promise<ApiResponse<any>> {
  return axios.get(
    `/deleteSession?user_id=${user_id}&session_id=${session_id}`
  );
}
