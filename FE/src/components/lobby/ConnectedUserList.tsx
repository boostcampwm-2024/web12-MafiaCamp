'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface ConnectedUserListProps {
  userList: string[];
}

const ConnectedUserList = ({ userList }: ConnectedUserListProps) => {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className='fixed left-0 top-0 z-50 h-full w-10'
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
              <p>온라인 0</p>
            </div>
          </motion.div>
        )}
        {visible && (
          <motion.div
            key='ConnectedUserList'
            className='absolute top-20 flex h-96 w-60 flex-col gap-4 rounded-r-2xl bg-slate-600/75 p-4 text-white drop-shadow'
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ bounce: false }}
          >
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
              <p>온라인 0</p>
            </div>
            <div className='w-full border-t border-white'>
              {userList.map((user, index) => (
                <p key={index}>{user}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectedUserList;
