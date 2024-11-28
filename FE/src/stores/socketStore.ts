import { Session } from 'openvidu-browser';
import { Socket } from 'socket.io-client';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

// 상태 인터페이스 정의
interface SocketState {
  socket: Socket | null;
  session: Session | null;
}

// 액션 인터페이스 정의
interface SocketAction {
  initializeSocketState: () => void;
  setSocketState: (data: Partial<SocketState>) => void;
}

// 초기 상태 정의
const initialState: SocketState = {
  socket: null,
  session: null,
};

type SocketStoreType = SocketState & SocketAction;

const socketStore: StateCreator<SocketStoreType> = (set) => ({
  ...initialState,
  initializeSocketState: () => set({ ...initialState }),
  setSocketState: (data: Partial<SocketState>) => set({ ...data }),
});

export const useSocketStore = create<SocketStoreType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(socketStore) as StateCreator<SocketStoreType>)
    : socketStore,
);
