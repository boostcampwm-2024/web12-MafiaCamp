'use client';

import PaperAirplainIcon from '@/components/common/icons/PaperAirplainIcon';
import ChattingItem from './ChattingItem';
import CloseIcon from '@/components/common/icons/CloseIcon';
import UsersIcon from '@/components/common/icons/UsersIcon';
import { useSidebarStore } from '@/stores/sidebarStore';
import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import { Chat } from '@/types/chat';

const ChattingList = () => {
  // TODO: 커스텀 훅 생성
  const { nickname, socket } = useSocketStore();
  const { isOpen, initialize, close } = useSidebarStore();
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [message, setMessage] = useState('');

  // TODO: 추후 수정 필요
  const [isMafiaOnly, setIsMafiaOnly] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit('send-chat', { message });
    setMessage('');
  };

  useEffect(() => {
    socket?.on('chat', (chat: Chat) => {
      setChatList([...chatList, chat]);
    });

    return () => {
      socket?.off('chat');
      initialize();
    };
  }, [chatList, initialize, socket]);

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
                  isSelf={chat.from === nickname}
                  nickname={chat.from}
                  content={chat.message}
                />
              ))
            )}
          </div>
          <form
            className='flex h-40 w-full flex-col items-center gap-4 bg-white p-4'
            onSubmit={handleSubmit}
          >
            <textarea
              className='h-[4.75rem] w-full resize-none rounded-lg p-3 text-sm text-slate-800 outline-none ring-1 ring-slate-400'
              value={message}
              autoComplete='off'
              placeholder='내용을 입력해 주세요.'
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                <p className='text-slate-800'>수신자</p>
                <button
                  className={`${isMafiaOnly && 'bg-transparent/10'} h-9 w-[3.75rem] rounded-2xl bg-slate-600 text-sm text-white hover:scale-105`}
                  type='button'
                  onClick={() => setIsMafiaOnly(false)}
                >
                  전체
                </button>
                <button
                  className={`${!isMafiaOnly && 'bg-transparent/10'} h-9 w-20 rounded-2xl bg-slate-600 text-sm text-white hover:scale-105`}
                  type='button'
                  onClick={() => setIsMafiaOnly(true)}
                >
                  마피아
                </button>
              </div>
              <button
                className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 hover:scale-105'
                type='submit'
              >
                <PaperAirplainIcon />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChattingList;
