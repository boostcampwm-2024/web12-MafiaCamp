'use client';

import Link from 'next/link';
import CloseIcon from '../icons/CloseIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { IoHome } from 'react-icons/io5';
import { MdGroups, MdLogin, MdLogout, MdSettings } from 'react-icons/md';
import { useSignout } from '@/hooks/common/useSignout';
import { useState } from 'react';
import NicknameModal from './NicknameModal';
import { useAuthStore } from '@/stores/authStore';

interface HeaderSidebarProps {
  visible: boolean;
  closeHeaderSidebar: () => void;
}

const HeaderSidebar = ({ visible, closeHeaderSidebar }: HeaderSidebarProps) => {
  const { nickname } = useAuthStore();
  const { handleSignout } = useSignout();
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);

  return (
    <AnimatePresence>
      {visible && (
        <div
          className='fixed left-0 top-0 z-20 flex h-[200%] w-full justify-end bg-black/25'
          onClick={() => {
            if (!nicknameModalVisible) {
              closeHeaderSidebar();
            }
          }}
        >
          {nicknameModalVisible && (
            <NicknameModal closeModal={() => setNicknameModalVisible(false)} />
          )}
          <motion.aside
            className='flex h-fit w-48 flex-col items-center rounded-b-2xl bg-slate-600 p-4 pb-8 text-slate-200'
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ bounce: false }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-3 flex w-full items-center justify-between'>
              <p className='max-w-32 truncate text-nowrap pl-3'>{nickname}</p>
              <CloseIcon
                className='cursor-pointer self-end rounded-lg fill-slate-200 hover:bg-slate-400'
                onClick={() => closeHeaderSidebar()}
              />
            </div>

            <motion.div
              className='w-full'
              initial={{ y: '1rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ delay: 0.2, bounce: false }}
            >
              <Link
                className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
                href='/'
                onClick={() => closeHeaderSidebar()}
              >
                <IoHome />
                <span>홈</span>
              </Link>
            </motion.div>
            <motion.div
              className='w-full'
              initial={{ y: '1rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ delay: 0.3, bounce: false }}
            >
              <Link
                className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
                href='/lobby'
                onClick={() => closeHeaderSidebar()}
              >
                <MdGroups />
                <span>로비</span>
              </Link>
            </motion.div>
            {nickname === '' ? (
              <motion.div
                className='w-full'
                initial={{ y: '1rem', opacity: 0 }}
                animate={{ y: '0rem', opacity: 1 }}
                transition={{ delay: 0.4, bounce: false }}
              >
                <Link
                  className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
                  href='/signin'
                  onClick={() => closeHeaderSidebar()}
                >
                  <MdLogin />
                  <span>로그인</span>
                </Link>
              </motion.div>
            ) : (
              <div className='w-full'>
                <motion.button
                  className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
                  initial={{ y: '1rem', opacity: 0 }}
                  animate={{ y: '0rem', opacity: 1 }}
                  transition={{ delay: 0.4, bounce: false }}
                  onClick={() => setNicknameModalVisible(true)}
                >
                  <MdSettings />
                  <span>닉네임 변경</span>
                </motion.button>
                <motion.button
                  className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
                  initial={{ y: '1rem', opacity: 0 }}
                  animate={{ y: '0rem', opacity: 1 }}
                  transition={{ delay: 0.5, bounce: false }}
                  onClick={async () => {
                    await handleSignout();
                    closeHeaderSidebar();
                  }}
                >
                  <MdLogout />
                  <span>로그아웃</span>
                </motion.button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HeaderSidebar;
