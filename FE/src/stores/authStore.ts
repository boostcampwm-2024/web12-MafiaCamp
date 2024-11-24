import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  userId: number;
  nickname: string;
}

interface AuthAction {
  initialize: () => void;
  setAuthState: (date: Partial<AuthState>) => void;
}

const initialState: AuthState = {
  userId: -1,
  nickname: '',
};

type AuthStoreType = AuthState & AuthAction;

const authStore: StateCreator<AuthStoreType> = (set) => ({
  ...initialState,
  initialize: () => set({ ...initialState }),
  setAuthState: (data: Partial<AuthState>) => set({ ...data }),
});

export const useAuthStore = create<AuthStoreType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(authStore) as StateCreator<AuthStoreType>)
    : authStore,
);
