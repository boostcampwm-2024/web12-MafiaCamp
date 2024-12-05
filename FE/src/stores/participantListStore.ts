import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ParticipantListState {
  participantList: { nickname: string; isOwner: boolean }[] | null;
}

interface ParticipantListAction {
  initialiseParticipantList: () => void;
  setParticipantList: (data: { nickname: string; isOwner: boolean }[]) => void;
}

const initialState: ParticipantListState = {
  participantList: null,
};

type ParticipantListStoreType = ParticipantListState & ParticipantListAction;

const participantListStore: StateCreator<ParticipantListStoreType> = (set) => ({
  ...initialState,
  initialiseParticipantList: () => set({ ...initialState }),
  setParticipantList: (data: { nickname: string; isOwner: boolean }[]) =>
    set({ participantList: data }),
});

export const useParticipantListStore = create<ParticipantListStoreType>()(
  process.env.NODE_ENV === 'development'
    ? (devtools(participantListStore) as StateCreator<ParticipantListStoreType>)
    : participantListStore,
);
