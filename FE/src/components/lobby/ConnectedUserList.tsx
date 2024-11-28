'use client';

import { useConnectedUserListStore } from '@/stores/connectedUserListStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const ConnectedUserList = () => {
  const { connectedUserList } = useConnectedUserListStore();
  const [visible, setVisible] = useState(false);

  return (
    <div
      className='fixed left-0 top-0 z-30 h-full w-10'
      onMouseOver={() => setVisible(true)}
      onMouseOut={() => setVisible(false)}
    >
      <AnimatePresence>
        {!visible && (
          <motion.div
            className='absolute top-20 text-nowrap rounded-r-2xl bg-slate-600/75 p-4 text-white'
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
          >
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
              <p>온라인 {Object.keys(connectedUserList).length}</p>
            </div>
          </motion.div>
        )}
        {visible && (
          <motion.div
            key='ConnectedUserList'
            className='absolute top-20 flex h-96 w-80 flex-col gap-4 rounded-r-2xl bg-slate-600/75 p-4 text-white drop-shadow'
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ bounce: false }}
          >
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
              <p>온라인 {Object.keys(connectedUserList).length}</p>
            </div>
            <div className='flex w-full snap-y flex-col overflow-y-auto border-t border-white pr-1 pt-2'>
              {Object.keys(connectedUserList).map((userId) => (
                <div
                  key={userId}
                  className='flex snap-start items-center gap-2 text-nowrap rounded-lg p-2 hover:bg-slate-500'
                >
                  <p
                    className={`${connectedUserList[userId].isInLobby ? 'text-emerald-400' : 'text-sky-400'} min-w-10 text-xs`}
                  >
                    {connectedUserList[userId].isInLobby ? '로비' : '게임 중'}
                  </p>
                  <p className='truncate text-sm'>
                    {connectedUserList[userId].nickname}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectedUserList;
