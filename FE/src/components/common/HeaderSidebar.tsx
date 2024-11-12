'use client';

import Link from 'next/link';
import CloseIcon from './icons/CloseIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { IoHome } from 'react-icons/io5';
import { MdGroups, MdLogin, MdLogout } from 'react-icons/md';

interface HeaderSidebarProps {
  visible: boolean;
  close: () => void;
}

const HeaderSidebar = ({ visible, close }: HeaderSidebarProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <div
          className='fixed left-0 top-0 z-20 flex h-[200%] w-full justify-end border border-white bg-black/25'
          onClick={() => close()}
        >
          <motion.aside
            className='flex h-fit w-52 flex-col items-center gap-4 rounded-b-2xl bg-white p-4 pb-16 text-xl text-slate-800'
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ bounce: false }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseIcon
              className='cursor-pointer self-end rounded-lg fill-slate-600 hover:bg-slate-100'
              onClick={() => close()}
            />
            <motion.div
              className='w-full'
              initial={{ y: '1rem', opacity: 0 }}
              animate={{ z: '0rem', opacity: 1 }}
              transition={{ delay: 0.2, bounce: false }}
            >
              <Link
                className='flex w-full flex-row items-center gap-2 p-3 hover:bg-slate-100'
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
                className='flex w-full flex-row items-center gap-2 p-3 hover:bg-slate-100'
                href='/lobby'
                onClick={() => close()}
              >
                <MdGroups />
                <span>로비</span>
              </Link>
            </motion.div>
            <motion.div
              className='w-full'
              initial={{ y: '1rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ delay: 0.4, bounce: false }}
            >
              <Link
                className='flex w-full flex-row items-center gap-2 p-3 hover:bg-slate-100'
                href='/signin'
                onClick={() => close()}
              >
                <MdLogin />
                <span>로그인</span>
              </Link>
            </motion.div>
            <motion.button
              className='flex w-full flex-row items-center gap-2 p-3 hover:bg-slate-100'
              initial={{ y: '1rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ delay: 0.5, bounce: false }}
              onClick={() => close()}
            >
              <MdLogout />
              <span>로그아웃</span>
            </motion.button>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HeaderSidebar;
