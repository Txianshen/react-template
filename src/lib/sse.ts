import { FetchSSE } from "./sse-fetch";
/**
 * SSE 响应数据类型
 */
interface SSEResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

/**
 * SSE 消息回调类型
 */
type OnMessageCallback<T = any> = (data: T) => void;
type OnStatusChangeCallback = (connected: boolean) => void;
type OnErrorCallback = (error: Event) => void;

/**
 * 通用 SSE 管理类
 */
class GenericSSE<T = any> {
  private eventSource: EventSource | null = null;
  private url: string;
  private reconnectInterval: number = 3000; // 重连间隔
  private reconnectTimer: NodeJS.Timeout | null = null;
  private onMessageCallback: OnMessageCallback<T> | null = null;
  private onStatusChangeCallback: OnStatusChangeCallback | null = null;
  private onErrorCallback: OnErrorCallback | null = null;
  private isManualClose: boolean = false;

  constructor(url: string, autoAppendBaseURL: boolean = true) {
    if (autoAppendBaseURL) {
      // 根据环境变量拼接完整 URL
      const baseURL = import.meta.env.VITE_API_SERVICE_URL
        ? `${import.meta.env.VITE_API_SERVICE_URL}${import.meta.env.VITE_API_BASE_URL}`
        : import.meta.env.VITE_API_BASE_URL;
      this.url = `${baseURL}${url}`;
    } else {
      this.url = url;
    }
  }

  /**
   * 连接 SSE
   */
  connect() {
    if (this.eventSource?.readyState === EventSource.OPEN) {
      console.log("SSE 已连接");
      return;
    }

    this.isManualClose = false;

    try {
      // 从localStorage获取token并添加到URL参数
      const token = localStorage.getItem("token");
      let urlWithToken = this.url;
      
      if (token) {
        const separator = this.url.includes('?') ? '&' : '?';
        urlWithToken = `${this.url}${separator}token=${encodeURIComponent(token)}`;
      }
      
      this.eventSource = new EventSource(urlWithToken);

      this.eventSource.onopen = () => {
        console.log("SSE 连接成功:", this.url);
        this.onStatusChangeCallback?.(true);
        // 清除重连定时器
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.eventSource.onmessage = (event) => {
        try {
          const response: SSEResponse<T> = JSON.parse(event.data);
          if (response.code === 200 && response.data !== undefined) {
            this.onMessageCallback?.(response.data);
          } else {
            console.warn("SSE 收到非成功响应:", response);
          }
        } catch (error) {
          console.error("SSE 消息解析失败:", error, event.data);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE 连接错误:", error);
        this.onStatusChangeCallback?.(false);
        this.onErrorCallback?.(error);

        // 关闭当前连接
        this.eventSource?.close();
        this.eventSource = null;

        // 非手动关闭时自动重连
        if (!this.isManualClose) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error("SSE 连接创建失败:", error);
      this.scheduleReconnect();
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect() {
    if (this.reconnectTimer || this.isManualClose) return;

    console.log(`${this.reconnectInterval}ms 后尝试重连...`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectInterval);
  }

  /**
   * 断开 SSE 连接
   */
  disconnect() {
    this.isManualClose = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log("SSE 已断开");
    }

    this.onStatusChangeCallback?.(false);
  }

  /**
   * 设置消息回调
   */
  onMessage(callback: OnMessageCallback<T>) {
    this.onMessageCallback = callback;
  }

  /**
   * 设置连接状态变化回调
   */
  onStatusChange(callback: OnStatusChangeCallback) {
    this.onStatusChangeCallback = callback;
  }

  /**
   * 设置错误回调
   */
  onError(callback: OnErrorCallback) {
    this.onErrorCallback = callback;
  }

  /**
   * 获取连接状态
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

export { GenericSSE, type SSEResponse };

/**
 * 创建计划 SSE 实例
 */
export function createPlanSSE(url?: string): GenericSSE<string> {
  const sseUrl = url || `/getCurrentPlan`;
  return new GenericSSE<string>(sseUrl, true);
}

/**
 * SSE配置选项
 */
export interface SSEOptions {
  /** 是否使用Fetch SSE（支持自定义header） */
  useFetchSSE?: boolean;
  /** 自定义headers */
  headers?: Record<string, string>;
  /** 会话ID */
  session_id?: string;
}

/**
 * 创建带认证的计划 SSE 实例（支持header和session_id）
 * 
 * @example
 * ```typescript
 * // 使用原生EventSource（token在URL中）
 * const sse1 = createAuthPlanSSE();
 * 
 * // 使用Fetch SSE（token在header中）
 * const sse2 = createAuthPlanSSE({ useFetchSSE: true });
 * 
 * // 使用Fetch SSE并添加自定义header
 * const sse3 = createAuthPlanSSE({ 
 *   useFetchSSE: true,
 *   headers: { "X-Custom": "value" }
 * });
 * 
 * // 使用Fetch SSE并传递session_id
 * const sse4 = createAuthPlanSSE({ 
 *   useFetchSSE: true,
 *   session_id: "your-session-id"
 * });
 * ```
 */
export function createAuthPlanSSE(options: SSEOptions = {}): GenericSSE<string> | FetchSSE<string> {
  const { useFetchSSE = false, headers = {}, session_id } = options;
  
  // 获取token
  const token = localStorage.getItem("token");
  
  if (useFetchSSE) {
    // 使用Fetch SSE，支持自定义header
    const authHeaders: Record<string, string> = { ...headers };
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
    
    // 构建URL，添加session_id参数
    let url = "/getCurrentPlan";
    if (session_id) {
      url += `?session_id=${session_id}`;
    }
    
    return new FetchSSE<string>(url, authHeaders, true);
  } else {
    // 使用原生EventSource，token在URL中
    const sseUrl = token ? `/getCurrentPlan?token=${encodeURIComponent(token)}` : `/getCurrentPlan`;
    return new GenericSSE<string>(sseUrl, true);
  }
}
