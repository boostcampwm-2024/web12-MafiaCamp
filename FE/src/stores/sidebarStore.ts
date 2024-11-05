import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

// 상태 인터페이스 정의
interface SidebarState {
  isOpen: boolean;
}

// 액션 인터페이스 정의
interface SidebarActions {
  initialize: () => void;
  open: () => void;
  close: () => void;
}

// 초기 상태 정의
const initialState: SidebarState = {
  isOpen: true,
};

export type SidebarStoreType = SidebarState & SidebarActions;

const sidebarStore: StateCreator<SidebarStoreType> = (set) => ({
  ...initialState,
  initialize: () => set({ ...initialState }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
});

export const useSidebarStore = create<SidebarStoreType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(sidebarStore) as StateCreator<SidebarStoreType>)
    : sidebarStore,
);