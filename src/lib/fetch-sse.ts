interface SSEResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

type OnMessageCallback<T = any> = (data: T) => void;
type OnStatusChangeCallback = (connected: boolean) => void;
type OnErrorCallback = (error: Error) => void;

class FetchSSE<T = any> {
  private controller: AbortController | null = null;
  private url: string;
  private reconnectInterval: number = 3000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
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
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      ...headers,
    };
  }

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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventBuffer = "";
      let connected = false;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.warn("SSE 流结束（可能是服务端关闭或网络问题）");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith(":")) {
            // 心跳行，忽略
            continue;
          } else if (line.startsWith("data:")) {
            eventBuffer += line.replace(/^data:\s?/, "");
          } else if (line.trim() === "") {
            // 空行表示事件结束
            if (eventBuffer) {
              try {
                const response: SSEResponse<T> = JSON.parse(eventBuffer);
                if (!connected) {
                  connected = true;
                  this.onStatusChangeCallback?.(true);
                }

                if (response.code === 200 && response.data !== undefined) {
                  this.onMessageCallback?.(response.data);
                } else {
                  console.warn("SSE 收到非成功响应:", response);
                }
              } catch (error) {
                console.error("SSE 消息解析失败:", error, eventBuffer);
              }
              eventBuffer = "";
            }
          }
        }
      }

      this.cleanup(false);
      if (!this.isManualClose) this.scheduleReconnect();
    } catch (error) {
      console.error("SSE 连接错误:", error);
      this.onErrorCallback?.(error as Error);
      this.cleanup(false);
      if (!this.isManualClose) this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || this.isManualClose) return;

    console.log(`${this.reconnectInterval}ms 后尝试重连...`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectInterval);
  }

  disconnect() {
    this.isManualClose = true;
    this.cleanup(true);
  }

  private cleanup(triggerStatusChange: boolean) {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.controller) {
      this.controller.abort();
      this.controller = null;
      console.log("SSE 已断开");
    }

    if (triggerStatusChange) {
      this.onStatusChangeCallback?.(false);
    }
  }

  onMessage(callback: OnMessageCallback<T>) {
    this.onMessageCallback = callback;
  }

  onStatusChange(callback: OnStatusChangeCallback) {
    this.onStatusChangeCallback = callback;
  }

  onError(callback: OnErrorCallback) {
    this.onErrorCallback = callback;
  }

  isConnected(): boolean {
    return this.controller !== null;
  }
}

export { FetchSSE, type SSEResponse };
