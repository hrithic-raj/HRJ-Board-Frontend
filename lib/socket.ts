import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

/** Creates (or reuses) the single socket connection, authenticated with the JWT. */
export const getSocket = (): Socket => {
  if (socket && socket.connected) return socket;

  const token = typeof window !== 'undefined' ? localStorage.getItem('kanban_token') : null;

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
