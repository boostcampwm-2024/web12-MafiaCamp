'use client';

import ChatBubbleIcon from '@/components/common/icons/ChatBubbleIcon';
import CloseIcon from '@/components/common/icons/CloseIcon';
import PlayIcon from '@/components/common/icons/PlayIcon';
import VideoCameraIcon from '@/components/common/icons/VideoCameraIcon';
import VideoCameraSlashIcon from '@/components/common/icons/VideoCameraSlashIcon';
import { Situation } from '@/constants/situation';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useSocketStore } from '@/stores/socketStore';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface BottombarProps {
  roomId: string;
  totalParticipants: number;
  situation: Situation | null;
  timeLeft: number;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

const Bottombar = ({
  roomId,
  totalParticipants,
  situation,
  timeLeft,
  audioEnabled,
  videoEnabled,
  toggleAudio,
  toggleVideo,
}: BottombarProps) => {
  const { isOpen, open, close } = useSidebarStore();
  const { socket } = useSocketStore();
  const {
    listRef,
    onDragStart,
    onDragMove,
    onDragEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useDragScroll();

  const capacity = useSearchParams().get('capacity');

  return (
    <div
      className={`${isOpen ? 'right-80' : 'right-0'} absolute bottom-0 left-0 flex h-16 flex-row items-center gap-4 text-nowrap bg-slate-600/50 pl-6 text-sm text-slate-200 transition-all duration-500 ease-out`}
    >
      <h1 className={`${situation === null && 'hidden'} text-lg text-white`}>
        {situation} / 남은 시간 / {timeLeft}
      </h1>
      <div
        className='flex w-full flex-row items-center justify-between gap-4 overflow-x-auto p-1 pr-6'
        ref={listRef}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className='flex flex-row items-center gap-4'>
          <button
            className={`${totalParticipants !== Number(capacity) ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'} flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4`}
            onClick={() => socket?.emit('start-game', { roomId })}
            disabled={totalParticipants !== Number(capacity)}
          >
            <PlayIcon className='fill-slate-200' />
            게임 시작
          </button>
          <button
            className={`${audioEnabled === undefined && 'hidden'} flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105`}
            onClick={() => toggleAudio()}
          >
            {audioEnabled ? (
              <FaMicrophone className='scale-125 cursor-pointer text-slate-200 hover:text-white' />
            ) : (
              <FaMicrophoneSlash className='scale-150 cursor-pointer text-slate-200 hover:text-white' />
            )}
            오디오
          </button>
          <button
            className={`${videoEnabled === undefined && 'hidden'} flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105`}
            onClick={() => toggleVideo()}
          >
            {videoEnabled ? (
              <VideoCameraIcon className='scale-90 cursor-pointer fill-slate-200 hover:fill-white' />
            ) : (
              <VideoCameraSlashIcon className='scale-90 cursor-pointer fill-slate-200 hover:fill-white' />
            )}
            카메라
          </button>
          <button
            className='flex h-10 items-center justify-center gap-2 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105'
            onClick={() => (isOpen ? close() : open())}
          >
            <ChatBubbleIcon className='fill-slate-200' />
            <p>댓글</p>
          </button>
        </div>
        <Link
          className='flex h-10 flex-row items-center gap-1 rounded-3xl border border-slate-400 bg-slate-600 px-4 hover:scale-105'
          href='/lobby'
        >
          <CloseIcon className='fill-slate-200' />
          <p>나가기</p>
        </Link>
      </div>
    </div>
  );
};

export default Bottombar;
