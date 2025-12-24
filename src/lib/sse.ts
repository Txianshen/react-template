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
      this.eventSource = new EventSource(this.url);

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
  const sseUrl = url || `/getCurrentPlana`;
  return new GenericSSE<string>(sseUrl, true);
}
