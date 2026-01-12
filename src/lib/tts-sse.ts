import { FetchSSE } from "./fetch-sse";

/**
 * TTS消息数据类型
 */
export interface TTSMessageData {
  msg: string;
}

/**
 * SSE 响应数据类型
 */
export interface SSEResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

/**
 * SSE 消息回调类型
 */
export type OnMessageCallback<T = any> = (data: T) => void;
export type OnStatusChangeCallback = (connected: boolean) => void;
export type OnErrorCallback = (error: any) => void;

/**
 * SSE配置选项（简化版 - 统一使用Fetch SSE）
 */
export interface TTSSSEOptions {
  /** 自定义headers */
  headers?: Record<string, string>;
  /** 会话ID */
  session_id?: string;
}

/**
 * 创建带认证的TTS消息 SSE 实例（统一使用Fetch SSE，支持header和session_id）
 *
 * @example
 * ```typescript
 * // 基础使用（token在header中）
 * const sse1 = createTTSSSE();
 *
 * // 添加自定义header
 * const sse2 = createTTSSSE({
 *   headers: { "X-Custom": "value" }
 * });
 *
 * // 传递session_id
 * const sse3 = createTTSSSE({
 *   session_id: "your-session-id"
 * });
 * ```
 */
export function createTTSSSE(
  options: TTSSSEOptions = {}
): FetchSSE<TTSMessageData> {
  const { headers = {}, session_id } = options;

  // 获取token
  const token = localStorage.getItem("token");
  const authHeaders: Record<string, string> = { ...headers };

  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  // 构建URL，添加session_id参数
  let url = "/streamTTSMsg";
  if (session_id) {
    url += `?session_id=${session_id}`;
  }

  return new FetchSSE<TTSMessageData>(url, authHeaders, true);
}
