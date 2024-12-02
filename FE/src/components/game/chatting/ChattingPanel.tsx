'use client';

import { AnimatePresence, motion } from 'framer-motion';
import ChattingList from './ChattingList';
import ChattingForm from './ChattingForm';
import { useSidebarStore } from '@/stores/sidebarStore';
import ChattingHeader from './ChattingHeader';
import { useChattingList } from '@/hooks/game/chatting/useChattingList';

interface ChattingPanelProps {
  roomId: string;
  isMafia: boolean;
  chatEnabled: boolean;
  totalParticipants: number;
}

const ChattingPanel = ({
  roomId,
  isMafia,
  chatEnabled,
  totalParticipants,
}: ChattingPanelProps) => {
  const { isOpen, closeSidebar } = useSidebarStore();
  const { chattingListRef, chatList } = useChattingList(isMafia);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='absolute right-0 top-0 flex h-screen w-80 flex-col justify-between bg-slate-600/50'
          initial={{ x: '20rem' }}
          animate={{ x: '0rem' }}
          exit={{ x: '20rem' }}
          transition={{ bounce: false, ease: 'easeOut' }}
        >
          <ChattingHeader
            totalParticipants={totalParticipants}
            closeSidebar={closeSidebar}
          />
          <ChattingList chatList={chatList} ref={chattingListRef} />
          {chatEnabled && <ChattingForm roomId={roomId} isMafia={isMafia} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChattingPanel;
