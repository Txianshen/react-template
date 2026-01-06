/**
 * 基于Fetch的SSE实现，支持自定义请求头
 */

interface SSEResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

type OnMessageCallback<T = any> = (data: T) => void;
type OnStatusChangeCallback = (connected: boolean) => void;
type OnErrorCallback = (error: Error) => void;

/**
 * 基于Fetch的SSE管理类
 */
class FetchSSE<T = any> {
  private controller: AbortController | null = null;
  private url: string;
  private reconnectInterval: number = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private onMessageCallback: OnMessageCallback<T> | null = null;
  private onStatusChangeCallback: OnStatusChangeCallback | null = null;
  private onErrorCallback: OnErrorCallback | null = null;
  private isManualClose: boolean = false;
  private headers: Record<string, string>;

  constructor(
    url: string, 
    headers: Record<string, string> = {},
    autoAppendBaseURL: boolean = true
  ) {
    if (autoAppendBaseURL) {
      const baseURL = import.meta.env.VITE_API_SERVICE_URL
        ? `${import.meta.env.VITE_API_SERVICE_URL}${import.meta.env.VITE_API_BASE_URL}`
        : import.meta.env.VITE_API_BASE_URL;
      this.url = `${baseURL}${url}`;
    } else {
      this.url = url;
    }
    
    this.headers = {
      "Accept": "text/event-stream",
      "Cache-Control": "no-cache",
      ...headers
    };
  }

  /**
   * 连接SSE
   */
  async connect() {
    if (this.controller) {
      console.log("SSE 已连接");
      return;
    }

    this.isManualClose = false;

    try {
      this.controller = new AbortController();
      
      const response = await fetch(this.url, {
        method: "GET",
        headers: this.headers,
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      this.onStatusChangeCallback?.(true);
      
      // 清除重连定时器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const response: SSEResponse<T> = JSON.parse(data);
              if (response.code === 200 && response.data !== undefined) {
                this.onMessageCallback?.(response.data);
              } else {
                console.warn("SSE 收到非成功响应:", response);
              }
            } catch (error) {
              console.error("SSE 消息解析失败:", error, data);
            }
          }
        }
      }

      // 连接正常关闭
      console.log("SSE 连接已关闭");
      this.disconnect();
      
      // 非手动关闭时自动重连
      if (!this.isManualClose) {
        this.scheduleReconnect();
      }
      
    } catch (error) {
      console.error("SSE 连接错误:", error);
      this.onErrorCallback?.(error as Error);
      this.onStatusChangeCallback?.(false);
      
      this.disconnect();
      
      // 非手动关闭时自动重连
      if (!this.isManualClose) {
        this.scheduleReconnect();
      }
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
   * 断开SSE连接
   */
  disconnect() {
    this.isManualClose = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.controller) {
      this.controller.abort();
      this.controller = null;
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
    return this.controller !== null;
  }
}

export { FetchSSE, type SSEResponse };

/**
 * 创建基于Fetch的计划SSE实例
 */
// export function createFetchPlanSSE(url?: string): FetchSSE<string> {
//   // 获取token并添加到headers
//   const token = localStorage.getItem("token");
//   const headers: Record<string, string> = {};
  
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }
  
//   const sseUrl = url || `/getCurrentPlan`;
//   return new FetchSSE<string>(sseUrl, headers, true);
// }