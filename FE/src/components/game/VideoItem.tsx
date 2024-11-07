'use client';

import VideoCameraIcon from '@/components/common/icons/VideoCameraIcon';
import VideoCameraSlashIcon from '@/components/common/icons/VideoCameraSlashIcon';
import { Publisher } from 'openvidu-browser';
import { useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface VideoItemProps {
  streamManager: Publisher | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

const VideoItem = ({
  streamManager,
  audioEnabled,
  videoEnabled,
}: VideoItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && streamManager) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className='flex w-full flex-col items-center rounded-3xl border border-slate-200 bg-slate-900'>
      {videoEnabled ? (
        <video
          className='h-full w-full rounded-t-3xl'
          ref={videoRef}
          autoPlay
          playsInline
        />
      ) : (
        <div className='h-full w-full rounded-t-3xl bg-slate-900' />
      )}

      <div className='flex w-full flex-row items-center justify-between gap-3 rounded-b-3xl bg-slate-600/50 px-4 py-3'>
        <p className='text-sm text-white'>HyunJinNo</p>
        <div className='flex flex-row items-center gap-3'>
          {audioEnabled ? (
            <FaMicrophone className='cursor-pointer text-slate-200 hover:text-white' />
          ) : (
            <FaMicrophoneSlash className='scale-125 cursor-pointer text-slate-200 hover:text-white' />
          )}
          {videoEnabled ? (
            <VideoCameraIcon className='scale-90 cursor-pointer fill-slate-200 hover:fill-white' />
          ) : (
            <VideoCameraSlashIcon className='scale-90 cursor-pointer fill-slate-200 hover:fill-white' />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
