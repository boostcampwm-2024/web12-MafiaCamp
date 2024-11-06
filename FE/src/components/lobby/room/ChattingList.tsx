'use client';

import PaperAirplainIcon from '@/components/common/icons/PaperAirplainIcon';
import ChattingItem from './ChattingItem';
import CloseIcon from '@/components/common/icons/CloseIcon';
import UsersIcon from '@/components/common/icons/UsersIcon';
import { useSidebarStore } from '@/stores/sidebarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// TODO
const chatList = [
  { isSelf: false, nickname: 'another1', content: '안녕하세요.' },
  {
    isSelf: false,
    nickname: 'another2',
    content: '안녕하세요. 만나서 반갑습니다.',
  },
  { isSelf: true, nickname: 'HyunJinNo', content: '안녕하세요.' },
  { isSelf: false, nickname: 'another1', content: '안녕하세요.' },
  {
    isSelf: false,
    nickname: 'another2',
    content: '안녕하세요. 만나서 반갑습니다.',
  },
  { isSelf: true, nickname: 'HyunJinNo', content: '안녕하세요.' },
  {
    isSelf: false,
    nickname: 'another2',
    content: '안녕하세요. 만나서 반갑습니다.',
  },
  { isSelf: true, nickname: 'HyunJinNo', content: '안녕하세요.' },
];

const ChattingList = () => {
  const { isOpen, initialize, close } = useSidebarStore();

  // TODO: 추후 수정 필요
  const [isMafiaOnly, setIsMafiaOnly] = useState(false);

  useEffect(() => {
    return () => {
      initialize();
    };
  }, [initialize]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='absolute right-0 top-0 flex h-screen w-80 flex-col justify-between bg-slate-600/50'
          initial={{ translateX: '100%' }}
          animate={{ translateX: '0%' }}
          exit={{ translateX: '100%' }}
          transition={{ bounce: false }}
        >
          <div className='flex h-16 w-full flex-row items-center justify-between gap-3 bg-slate-600 p-4 text-white'>
            <h2 className='truncate text-nowrap text-sm'>
              마피아 게임을 좋아하는 누구나 환영합니다.
            </h2>
            <div className='flex flex-row items-center gap-3'>
              <div className='flex flex-row items-center gap-2 text-sm'>
                <UsersIcon />
                <p className='text-nowrap text-white'>
                  6 / <span className='font-bold'>8</span>
                </p>
              </div>
              <CloseIcon
                className='cursor-pointer rounded-lg fill-white hover:bg-slate-400'
                onClick={() => close()}
              />
            </div>
          </div>
          <div className='flex h-full w-full flex-col gap-4 overflow-y-scroll px-4 py-4'>
            {chatList.length === 0 ? (
              <p className='self-center text-sm text-slate-200'>
                댓글을 작성해 보세요.
              </p>
            ) : (
              chatList.map((chat, index) => (
                <ChattingItem
                  key={index}
                  isSelf={chat.isSelf}
                  nickname={chat.nickname}
                  content={chat.content}
                />
              ))
            )}
          </div>
          <div className='flex h-40 w-full flex-col items-center gap-4 bg-white p-4'>
            <textarea
              className='h-[4.75rem] w-full resize-none rounded-lg p-3 text-sm text-slate-800 outline-none ring-1 ring-slate-400'
              placeholder='내용을 입력해 주세요.'
            />
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                <p className='text-slate-800'>수신자</p>
                <button
                  className={`${isMafiaOnly && 'bg-transparent/10'} h-9 w-[3.75rem] rounded-2xl bg-slate-600 text-sm text-white hover:scale-105`}
                  onClick={() => setIsMafiaOnly(false)}
                >
                  전체
                </button>
                <button
                  className={`${!isMafiaOnly && 'bg-transparent/10'} h-9 w-20 rounded-2xl bg-slate-600 text-sm text-white hover:scale-105`}
                  onClick={() => setIsMafiaOnly(true)}
                >
                  마피아
                </button>
              </div>
              <button className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 hover:scale-105'>
                <PaperAirplainIcon />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChattingList;
