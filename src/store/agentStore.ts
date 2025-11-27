import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// 智能体类型
export type AgentType =
  | "general"
  | "recon"
  | "port_scan"
  | "web_redteam"
  | "apitest"
  | "vulscan"
  | "vulexp"
  | "code_audit"
  | "post_pentest";

// 模型配置类型
interface ModelConfig {
  provider: string; // DeepSeek / OpenAI / 通义千问 / 自定义模型
  modelName: string; // 具体模型名称
  apiKey?: string; // 自定义模型的 API Key
  baseUrl?: string; // 自定义模型的 Base URL
}

// 全局配置类型
interface GlobalConfig {
  turns: number; // 最大对话轮数
  model: ModelConfig; // 模型配置
  mode: "Pentest" | "CTF"; // 工作模式
}

// 智能体状态类型
interface AgentState {
  // ==================== 运行状态 ====================
  // 所有智能体的运行状态（全局管理）
  runningAgents: Record<AgentType, boolean>;

  // ==================== 全局配置 ====================
  globalConfig: GlobalConfig;

  // ==================== 综合智能体特有状态 ====================
  currentPlan: string; // 当前渗透计划（仅综合智能体）
  historyList: string[]; // 历史会话列表（仅综合智能体）
  reportList: string[]; // 报告文件列表（仅综合智能体）

  // ==================== Actions ====================
  // 启动智能体
  startAgent: (type: AgentType, historySession?: string) => Promise<void>;

  // 停止智能体
  stopAgent: (type: AgentType) => Promise<void>;

  // 更新全局配置
  updateGlobalConfig: (config: Partial<GlobalConfig>) => void;

  // 更新渗透计划（仅综合智能体）
  updatePlan: (plan: string) => void;

  // 加载历史记录（仅综合智能体）
  loadHistory: (timestamp: string) => Promise<void>;

  // 刷新报告列表（仅综合智能体）
  refreshReportList: () => Promise<void>;
}

// 创建 Zustand Store
export const useAgentStore = create<AgentState>()(
  devtools(
    persist(
      (set, get) => ({
        // ==================== 初始状态 ====================
        runningAgents: {
          general: false,
          recon: false,
          port_scan: false,
          web_redteam: false,
          apitest: false,
          vulscan: false,
          vulexp: false,
          code_audit: false,
          post_pentest: false,
        },

        globalConfig: {
          turns: 50,
          model: {
            provider: "DeepSeek",
            modelName: "deepseek-v3",
          },
          mode: "Pentest",
        },

        currentPlan: "## 🔍 暂无渗透计划",
        historyList: [],
        reportList: [],

        // ==================== Actions 实现 ====================

        /**
         * 启动智能体
         */
        startAgent: async (type, historySession) => {
          try {
            // TODO: 调用后端 API 启动智能体
            // const response = await agentsAPI.start(type, historySession);

            // 模拟 API 调用
            console.log(`[Store] 启动智能体: ${type}`, { historySession });

            // 更新运行状态
            set((state) => ({
              runningAgents: {
                ...state.runningAgents,
                [type]: true,
              },
            }));

            // 如果是综合智能体且提供了历史会话，加载历史记录
            if (type === "general" && historySession) {
              await get().loadHistory(historySession);
            }
          } catch (error) {
            console.error(`[Store] 启动智能体失败:`, error);
            throw error;
          }
        },

        /**
         * 停止智能体
         */
        stopAgent: async (type) => {
          try {
            // TODO: 调用后端 API 停止智能体
            // await agentsAPI.stop(type);

            // 模拟 API 调用
            console.log(`[Store] 停止智能体: ${type}`);

            // 更新运行状态
            set((state) => ({
              runningAgents: {
                ...state.runningAgents,
                [type]: false,
              },
            }));
          } catch (error) {
            console.error(`[Store] 停止智能体失败:`, error);
            throw error;
          }
        },

        /**
         * 更新全局配置
         */
        updateGlobalConfig: (config) => {
          set((state) => ({
            globalConfig: {
              ...state.globalConfig,
              ...config,
            },
          }));

          console.log("[Store] 全局配置已更新:", get().globalConfig);
        },

        /**
         * 更新渗透计划（仅综合智能体）
         */
        updatePlan: (plan) => {
          set({ currentPlan: plan });
          console.log("[Store] 渗透计划已更新");
        },

        /**
         * 加载历史记录（仅综合智能体）
         */
        loadHistory: async (timestamp) => {
          try {
            // TODO: 调用后端 API 加载历史记录
            // const history = await agentsAPI.loadHistory(timestamp);

            console.log(`[Store] 加载历史记录: ${timestamp}`);

            // TODO: 更新聊天消息（这部分是局部状态，在组件中处理）
          } catch (error) {
            console.error("[Store] 加载历史记录失败:", error);
            throw error;
          }
        },

        /**
         * 刷新报告列表（仅综合智能体）
         */
        refreshReportList: async () => {
          try {
            // TODO: 调用后端 API 获取报告列表
            // const reports = await agentsAPI.getReportList();

            // 模拟数据
            const mockReports = [
              "report_2024-01-15.pdf",
              "report_2024-01-14.pdf",
            ];

            set({ reportList: mockReports });
            console.log("[Store] 报告列表已刷新");
          } catch (error) {
            console.error("[Store] 刷新报告列表失败:", error);
            throw error;
          }
        },
      }),
      {
        name: "agent-storage", // localStorage key
        // 只持久化全局配置，运行状态、模型选项不持久化（每次进入设置页面时从后端获取最新数据）
        partialize: (state) => ({
          globalConfig: state.globalConfig,
        }),
      }
    ),
    {
      name: "AgentStore", // DevTools 名称
    }
  )
);
