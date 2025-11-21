import axios from "./axiosInstance";
import type { AgentType } from "@/store/agentStore";

/**
 * 智能体管理 API
 */
export const agentsAPI = {
  /**
   * 启动智能体
   * @param type 智能体类型
   * @param historySession 历史会话 ID（可选，仅综合智能体）
   */
  start: async (type: AgentType, historySession?: string) => {
    return axios.post(`/api/agents/${type}/start`, {
      historySession,
    });
  },

  /**
   * 停止智能体
   * @param type 智能体类型
   */
  stop: async (type: AgentType) => {
    return axios.post(`/api/agents/${type}/stop`);
  },

  /**
   * 获取智能体运行状态
   * @param type 智能体类型
   */
  getStatus: async (type: AgentType) => {
    return axios.get<{ running: boolean }>(`/api/agents/${type}/status`);
  },

  /**
   * 发送消息到智能体（SSE 流式）
   * @param type 智能体类型
   * @param message 用户消息
   * @param onChunk 接收流式数据的回调
   * @returns EventSource 实例
   */
  sendMessage: (
    type: AgentType,
    message: string,
    onChunk: (data: string) => void
  ) => {
    // 使用 SSE (Server-Sent Events) 实现流式响应

    // sse默认支持get方法传参 后续后端对接沟通传参
    const eventSource = new EventSource(
      `/api/agents/${type}/chat?message=${encodeURIComponent(message)}`
    );

    eventSource.onmessage = (event) => {
      onChunk(event.data);
    };

    eventSource.onerror = (error) => {
      console.error("[SSE] 连接错误:", error);
      eventSource.close();
    };

    return eventSource;
  },

  // ==================== 综合智能体特有 API ====================

  /**
   * 获取历史渗透会话列表
   */
  getHistoryList: async () => {
    return axios.get<string[]>("/api/agents/general/history");
  },

  /**
   * 加载历史会话的聊天记录
   * @param timestamp 会话时间戳
   */
  loadHistory: async (timestamp: string) => {
    return axios.post<{ messages: Record<string, unknown>[] }>(
      "/api/agents/general/history/load",
      {
        timestamp,
      }
    );
  },

  /**
   * 获取渗透报告列表
   */
  getReportList: async () => {
    return axios.get<string[]>("/api/reports");
  },

  /**
   * 下载渗透报告
   * @param filename 报告文件名
   */
  downloadReport: async (filename: string) => {
    return axios.get(`/api/reports/${filename}`, {
      responseType: "blob",
    });
  },
};
