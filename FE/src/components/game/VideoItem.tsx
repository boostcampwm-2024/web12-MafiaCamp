'use client';

import VideoCameraIcon from '@/components/common/icons/VideoCameraIcon';
import VideoCameraSlashIcon from '@/components/common/icons/VideoCameraSlashIcon';
import { Publisher, Subscriber } from 'openvidu-browser';
import { useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface VideoItemProps {
  nickname: string;
  streamManager: Publisher | Subscriber | null;
}

const VideoItem = ({ nickname, streamManager }: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && streamManager) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className='flex w-full flex-col items-center rounded-3xl border border-slate-200 bg-slate-900'>
      <video
        className='h-full w-full overflow-y-hidden rounded-t-3xl object-cover'
        ref={videoRef}
        autoPlay
        playsInline
      />
      <div className='flex w-full flex-row items-center justify-between gap-3 rounded-b-3xl bg-slate-600/50 px-4 py-3'>
        <p className='text-sm text-white'>{nickname}</p>
        <div className='flex flex-row items-center gap-3'>
          {streamManager?.stream.audioActive ? (
            <FaMicrophone className='text-slate-200' />
          ) : (
            <FaMicrophoneSlash className='scale-125 text-slate-200' />
          )}
          {streamManager?.stream.videoActive ? (
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
