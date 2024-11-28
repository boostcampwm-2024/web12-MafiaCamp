import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ConnectedUserListState {
  connectedUserList: Map<number, { nickname: string; isInLobby: boolean }>;
}

interface ConnectedUserListAction {
  setConnectedUserList: (data: {
    [userId: number]: { nickname: string; isInLobby: boolean };
  }) => void;
  updateConnectedUserList: (data: {
    userId: number;
    nickname: string;
    isInLobby: boolean;
  }) => void;
  deleteUser: (userId: number) => void;
}

const initialState: ConnectedUserListState = {
  connectedUserList: new Map<
    number,
    { nickname: string; isInLobby: boolean }
  >(),
};

type ConnectedUserListType = ConnectedUserListState & ConnectedUserListAction;

const connectedUserListStore: StateCreator<ConnectedUserListType> = (set) => ({
  ...initialState,
  setConnectedUserList: (data: {
    [userId: number]: { nickname: string; isInLobby: boolean };
  }) =>
    set(() => {
      const newConnectedUserList = new Map<
        number,
        { nickname: string; isInLobby: boolean }
      >();

      Object.keys(data).forEach((userId) => {
        newConnectedUserList.set(Number(userId), data[Number(userId)]);
      });

      return { connectedUserList: newConnectedUserList };
    }),
  updateConnectedUserList: (data: {
    userId: number;
    nickname: string;
    isInLobby: boolean;
  }) =>
    set((state) => {
      const updatedConnectedUserList = new Map(state.connectedUserList);
      updatedConnectedUserList.set(data.userId, {
        nickname: data.nickname,
        isInLobby: data.isInLobby,
      });

      return { connectedUserList: updatedConnectedUserList };
    }),
  deleteUser: (userId: number) =>
    set((state) => {
      const updatedConnectedUserList = new Map(state.connectedUserList);
      updatedConnectedUserList.delete(userId);

      return { connectedUserList: updatedConnectedUserList };
    }),
});

export const useConnectedUserListStore = create<ConnectedUserListType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(connectedUserListStore) as StateCreator<ConnectedUserListType>)
    : connectedUserListStore,
);
