import { Socket } from 'socket.io-client';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

// 상태 인터페이스 정의
interface SocketState {
  socket: Socket | null;
}

// 액션 인터페이스 정의
interface SocketActions {
  connect: (socket: Socket) => void;
  disconnect: () => void;
}

// 초기 상태 정의
const initialState: SocketState = {
  socket: null,
};

export type SocketStoreType = SocketState & SocketActions;

const socketStore: StateCreator<SocketStoreType> = (set) => ({
  ...initialState,
  connect: (socket: Socket) => set({ socket }),
  disconnect: () => set({ socket: null }),
});

export const useSocketStore = create<SocketStoreType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(socketStore) as StateCreator<SocketStoreType>)
    : socketStore,
);
