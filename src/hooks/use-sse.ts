import { useCallback, useEffect, useRef } from "react";

type EventHandler = (data: unknown, event?: MessageEvent) => void;

interface UseSSE {
  connect: (url: string, options?: EventSourceInit) => void;
  disconnect: () => void;
  subscribe: (event: string, handler: EventHandler) => void;
  unsubscribe: (event: string, handler: EventHandler) => void;
  isConnected: () => boolean;
}

export function useSSE(): UseSSE {
  const esRef = useRef<EventSource | null>(null);
  const handlersRef = useRef<Map<string, Set<EventHandler>>>(new Map());
  // 关闭连接
  const disconnect = useCallback(() => {
    if (esRef.current) {
      console.log("[SSE] Disconnected");
      esRef.current.close();
      esRef.current = null;
    }
  }, []);
  // 建立连接
  const connect = useCallback(
    (url: string, options?: EventSourceInit) => {
      // if (esRef.current) return; // 已经连接了
      // 先断开旧的
      disconnect();
      const es = new EventSource(url, options);

      es.onopen = () => {
        console.log("[SSE] Connected:", url);
      };

      es.onerror = (err) => {
        console.error("[SSE] Error:", err);
        // 自动断开（可按需求改成重连）
        es.close();
        esRef.current = null;
      };

      es.onmessage = (e) => {
        // 默认事件（没有 eventName）
        const set = handlersRef.current.get("message");
        if (set) {
          set.forEach((h) => h(parseData(e.data), e));
        }
      };

      // 任意自定义事件
      // es.addEventListener("*", (e: any) => {
      //   const set = handlersRef.current.get(e.type);
      //   if (set) {
      //     set.forEach((h) => h(parseData(e.data), e));
      //   }
      // });
      // ✅ 连接建立时，把所有订阅过的事件都绑定一次
      handlersRef.current.forEach((_set, event) => {
        if (event !== "message") {
          es.addEventListener(event, (e: MessageEvent) => {
            const set = handlersRef.current.get(event);
            if (set) {
              set.forEach((h) => h(parseData(e.data), e));
            }
          });
        }
      });

      esRef.current = es;
    },
    [disconnect]
  );

  // 订阅
  const subscribe = useCallback((event: string, handler: EventHandler) => {
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set());
      if (esRef.current) {
        esRef.current.addEventListener(event, (e: MessageEvent) => {
          const set = handlersRef.current.get(event);
          if (set) {
            set.forEach((h) => h(parseData(e.data), e));
          }
        });
      }
    }
    handlersRef.current.get(event)?.add(handler);
  }, []);

  // 取消订阅
  const unsubscribe = useCallback((event: string, handler: EventHandler) => {
    handlersRef.current.get(event)?.delete(handler);
  }, []);

  // 是否连接中
  const isConnected = useCallback(() => !!esRef.current, []);

  // 组件卸载时清理
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, subscribe, unsubscribe, isConnected };
}

// 工具函数：尝试 JSON.parse
function parseData(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}
