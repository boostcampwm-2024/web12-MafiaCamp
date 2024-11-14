'use client';

import VideoCameraIcon from '@/components/common/icons/VideoCameraIcon';
import VideoCameraSlashIcon from '@/components/common/icons/VideoCameraSlashIcon';
import { ROLE, Role } from '@/constants/role';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import { useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface VideoItemProps {
  nickname: string;
  role: Role | null;
  gameParticipant: GamePublisher | GameSubscriber | null;
}

const VideoItem = ({ nickname, role, gameParticipant }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && gameParticipant) {
      gameParticipant.participant.addVideoElement(videoRef.current);
    }
  }, [gameParticipant]);

  return (
    <div className='relative flex h-full w-full flex-col items-center rounded-3xl border border-slate-200 bg-slate-900'>
      <div
        className={`${role === null && 'hidden'} absolute left-4 top-4 flex h-8 w-20 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-xs text-blue-800`}
      >
        {ROLE[role ?? 'CITIZEN']}
      </div>
      <video
        className='h-full w-full overflow-y-hidden rounded-t-3xl object-cover'
        ref={videoRef}
        autoPlay
        playsInline
      />
      <div className='flex w-full flex-row items-center justify-between gap-3 rounded-b-3xl bg-slate-600/50 px-4 py-3'>
        <p className='text-sm text-white'>{nickname}</p>
        <div className='flex flex-row items-center gap-3'>
          {gameParticipant?.audioEnabled ? (
            <FaMicrophone className='text-slate-200' />
          ) : (
            <FaMicrophoneSlash className='scale-125 text-slate-200' />
          )}
          {gameParticipant?.videoEnabled ? (
            <VideoCameraIcon className='scale-90 fill-slate-200' />
          ) : (
            <VideoCameraSlashIcon className='scale-90 fill-slate-200' />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
