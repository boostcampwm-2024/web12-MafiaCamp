import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  userId: string;
  nickname: string;
}

interface AuthAction {
  initializeAuthState: () => void;
  setAuthState: (date: Partial<AuthState>) => void;
}

const initialState: AuthState = {
  userId: '',
  nickname: '',
};

type AuthStoreType = AuthState & AuthAction;

const authStore: StateCreator<AuthStoreType> = (set) => ({
  ...initialState,
  initializeAuthState: () => set({ ...initialState }),
  setAuthState: (data: Partial<AuthState>) => set({ ...data }),
});

export const useAuthStore = create<AuthStoreType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(authStore) as StateCreator<AuthStoreType>)
    : authStore,
);
