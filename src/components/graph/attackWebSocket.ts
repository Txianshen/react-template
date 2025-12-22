/**
 * 攻击状态数据类型
 */
export interface AttackStatus {
  compromised_ips: string[]; // 已被攻破的IP列表
  current_attack_ip: string; // 当前正在被攻击的IP
}

/**
 * WebSocket 消息回调类型
 */
type OnMessageCallback = (data: AttackStatus) => void;
type OnStatusChangeCallback = (connected: boolean) => void;

/**
 * 攻击状态 WebSocket 管理类
 */
class AttackWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 3000; // 重连间隔
  private reconnectTimer: NodeJS.Timeout | null = null;
  private onMessageCallback: OnMessageCallback | null = null;
  private onStatusChangeCallback: OnStatusChangeCallback | null = null;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 连接 WebSocket
   */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket 已连接");
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("攻击状态 WebSocket 已连接");
        this.onStatusChangeCallback?.(true);
        // 清除重连定时器
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: AttackStatus = JSON.parse(event.data);
          console.log("收到攻击状态数据:", data);
          this.onMessageCallback?.(data);
        } catch (error) {
          console.error("解析 WebSocket 消息失败:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket 连接已关闭");
        this.onStatusChangeCallback?.(false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket 错误:", error);
        this.onStatusChangeCallback?.(false);
      };
    } catch (error) {
      console.error("WebSocket 连接失败:", error);
      this.scheduleReconnect();
    }
  }

  /**
   * 计划重连
   */
  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      console.log("尝试重新连接 WebSocket...");
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectInterval);
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 设置消息回调
   */
  onMessage(callback: OnMessageCallback) {
    this.onMessageCallback = callback;
  }

  /**
   * 设置连接状态变化回调
   */
  onStatusChange(callback: OnStatusChangeCallback) {
    this.onStatusChangeCallback = callback;
  }

  /**
   * 获取连接状态
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

/**
 * 创建攻击状态 WebSocket 实例
 * TODO: 替换为实际的 WebSocket 地址
 */
export function createAttackWebSocket(url?: string): AttackWebSocket {
  const wsUrl = url || `ws://${window.location.host}/ws/playgroundStatus`;
  return new AttackWebSocket(wsUrl);
}

export { AttackWebSocket };
