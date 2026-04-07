'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let sharedSocket: Socket | null = null;

function getSocketUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocal) {
      return `${window.location.protocol}//${window.location.hostname}:3001`;
    }
    return window.location.origin;
  }
  return 'http://localhost:3001';
}

function getSharedSocket(): Socket {
  if (!sharedSocket) {
    sharedSocket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }

  return sharedSocket;
}

export function useSocket(): Socket {
  const socket = useMemo(() => getSharedSocket(), []);
  return socket;
}

export function useSocketConnectionStatus() {
  const socket = useSocket();
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  return connected;
}
