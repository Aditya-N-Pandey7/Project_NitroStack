"use client";

import { useEffect, useRef, useState } from "react";

import { WS_URL } from "@/services/api";

interface UseWebSocketOptions<T> {
  onMessage?: (data: T) => void;
  reconnectDelayMs?: number;
}

export function useWebSocket<T = unknown>(
  options: UseWebSocketOptions<T> = {}
) {
  const { onMessage, reconnectDelayMs = 3000 } = options;
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    const connect = () => {
      socket = new WebSocket(WS_URL);

      socket.onopen = () => setConnected(true);

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessageRef.current?.(message as T);
        } catch (err) {
          console.error("WebSocket parse error:", err);
        }
      };

      socket.onclose = () => {
        setConnected(false);
        if (!closed) {
          reconnectTimer = setTimeout(connect, reconnectDelayMs);
        }
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [reconnectDelayMs]);

  return { connected };
}
