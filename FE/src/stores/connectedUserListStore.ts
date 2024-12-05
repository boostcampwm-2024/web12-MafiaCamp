import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ConnectedUserListState {
  connectedUserList: Record<string, { nickname: string; isInLobby: boolean }>;
}

interface ConnectedUserListAction {
  setConnectedUserList: (data: {
    [userId: string]: { nickname: string; isInLobby: boolean };
  }) => void;
  updateConnectedUserList: (data: {
    userId: string;
    nickname: string;
    isInLobby: boolean;
  }) => void;
  deleteUser: (userId: string) => void;
}

const initialState: ConnectedUserListState = {
  connectedUserList: {},
};

type ConnectedUserListType = ConnectedUserListState & ConnectedUserListAction;

const connectedUserListStore: StateCreator<ConnectedUserListType> = (set) => ({
  ...initialState,
  setConnectedUserList: (data: {
    [userId: number]: { nickname: string; isInLobby: boolean };
  }) =>
    set(() => {
      const newConnectedUserList: Record<
        string,
        { nickname: string; isInLobby: boolean }
      > = {};
      Object.entries(data).forEach(([userId, userData]) => {
        newConnectedUserList[userId] = userData;
      });
      return { connectedUserList: newConnectedUserList };
    }),
  updateConnectedUserList: (data: {
    userId: string;
    nickname: string;
    isInLobby: boolean;
  }) =>
    set((state) => {
      const updatedConnectedUserList = { ...state.connectedUserList };
      updatedConnectedUserList[data.userId] = {
        nickname: data.nickname,
        isInLobby: data.isInLobby,
      };
      return { connectedUserList: updatedConnectedUserList };
    }),
  deleteUser: (userId: string) =>
    set((state) => {
      const updatedConnectedUserList = { ...state.connectedUserList };
      delete updatedConnectedUserList[userId];
      return { connectedUserList: updatedConnectedUserList };
    }),
});

export const useConnectedUserListStore = create<ConnectedUserListType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(connectedUserListStore) as StateCreator<ConnectedUserListType>)
    : connectedUserListStore,
);
