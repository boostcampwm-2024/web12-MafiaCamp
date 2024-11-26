'use client';

import Link from 'next/link';
import CloseIcon from '../icons/CloseIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { IoHome } from 'react-icons/io5';
import { MdGroups, MdLogin, MdLogout } from 'react-icons/md';
import { useSignout } from '@/hooks/useSignout';

interface HeaderSidebarProps {
  visible: boolean;
  close: () => void;
}

const HeaderSidebar = ({ visible, close }: HeaderSidebarProps) => {
  const { nickname, handleSignout } = useSignout();

  return (
    <AnimatePresence>
      {visible && (
        <div
          className='fixed left-0 top-0 z-20 flex h-[200%] w-full justify-end border border-white bg-black/25'
          onClick={() => close()}
        >
          <motion.aside
            className='flex h-fit w-48 flex-col items-center rounded-b-2xl bg-slate-600 p-4 pb-8 text-slate-200'
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ bounce: false }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseIcon
              className='mb-4 cursor-pointer self-end rounded-lg fill-slate-200 hover:bg-slate-400'
              onClick={() => close()}
            />
            <motion.div
              className='w-full'
              initial={{ y: '1rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ delay: 0.2, bounce: false }}
            >
              <Link
                className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
                href='/'
                onClick={() => close()}
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
                onClick={() => close()}
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
                  onClick={() => close()}
                >
                  <MdLogin />
                  <span>로그인</span>
                </Link>
              </motion.div>
            ) : (
              <motion.button
                className='flex w-full flex-row items-center gap-2 rounded-xl p-3 hover:bg-slate-400'
                initial={{ y: '1rem', opacity: 0 }}
                animate={{ y: '0rem', opacity: 1 }}
                transition={{ delay: 0.4, bounce: false }}
                onClick={handleSignout}
              >
                <MdLogout />
                <span>로그아웃</span>
              </motion.button>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HeaderSidebar;
