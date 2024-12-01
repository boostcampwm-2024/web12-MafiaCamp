'use client';

import { AnimatePresence, motion } from 'framer-motion';
import ChattingList from './ChattingList';
import ChattingForm from './ChattingForm';
import { useSidebarStore } from '@/stores/sidebarStore';
import ChattingHeader from './ChattingHeader';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='absolute right-0 top-0 flex h-screen w-80 flex-col justify-between bg-slate-600/50'
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ bounce: false }}
        >
          <ChattingHeader
            totalParticipants={totalParticipants}
            closeSidebar={closeSidebar}
          />
          <ChattingList isMafia={isMafia} />
          {chatEnabled && <ChattingForm roomId={roomId} isMafia={isMafia} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChattingPanel;
