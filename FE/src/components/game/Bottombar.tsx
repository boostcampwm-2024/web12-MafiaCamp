'use client';

import ChatBubbleIcon from '@/components/common/icons/ChatBubbleIcon';
import CloseIcon from '@/components/common/icons/CloseIcon';
import PlayIcon from '@/components/common/icons/PlayIcon';
import VideoCameraIcon from '@/components/common/icons/VideoCameraIcon';
import VideoCameraSlashIcon from '@/components/common/icons/VideoCameraSlashIcon';
import useDragScroll from '@/hooks/useDragScroll';
import { useSidebarStore } from '@/stores/sidebarStore';
import Link from 'next/link';
import { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const Bottombar = () => {
  const { isOpen, open, close } = useSidebarStore();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const {
    listRef,
    onDragStart,
    onDragMove,
    onDragEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useDragScroll();

  return (
    <div
      className={`${isOpen ? 'right-80' : 'right-0'} absolute bottom-0 left-0 flex h-16 flex-row items-center justify-between gap-4 overflow-x-auto text-nowrap bg-slate-600/50 px-6 text-sm text-slate-200 transition-all duration-500 ease-out`}
      ref={listRef}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className='flex flex-row items-center gap-6'>
        <h1 className='text-lg text-white'>남은 시간 / 01:15</h1>
        <div className='flex flex-row items-center gap-4'>
          <button className='flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105'>
            <PlayIcon className='fill-slate-200' />
            <p>게임 시작</p>
          </button>
          <button
            className='flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105'
            onClick={() => setIsAudioOn(!isAudioOn)}
          >
            {isAudioOn ? (
              <FaMicrophone className='scale-125 cursor-pointer text-slate-200 hover:text-white' />
            ) : (
              <FaMicrophoneSlash className='scale-150 cursor-pointer text-slate-200 hover:text-white' />
            )}
            <p>오디오</p>
          </button>
          <button
            className='flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105'
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            {isCameraOn ? (
              <VideoCameraIcon className='scale-90 cursor-pointer fill-slate-200 hover:fill-white' />
            ) : (
              <VideoCameraSlashIcon className='scale-90 cursor-pointer fill-slate-200 hover:fill-white' />
            )}
            <p>카메라</p>
          </button>
          <button
            className='flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105'
            onClick={() => (isOpen ? close() : open())}
          >
            <ChatBubbleIcon className='fill-slate-200' />
            <p>댓글</p>
          </button>
        </div>
      </div>
      <Link
        className='flex h-10 flex-row items-center gap-1 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105'
        href='/lobby'
      >
        <CloseIcon className='fill-slate-200' />
        <p>나가기</p>
      </Link>
    </div>
  );
};

export default Bottombar;
