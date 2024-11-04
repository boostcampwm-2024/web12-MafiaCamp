'use client';

import VideoCameraIcon from '@/components/common/icons/VideoCameraIcon';
import VideoCameraSlashIcon from '@/components/common/icons/VideoCameraSlashIcon';
import { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const VideoItem = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  return (
    <div className='flex w-full flex-col items-center rounded-3xl border border-slate-200 bg-slate-900'>
      <div className='h-full w-full rounded-t-3xl bg-slate-900'></div>
      <div className='flex w-full flex-row items-center justify-between gap-3 rounded-b-3xl bg-slate-600/50 px-4 py-3'>
        <p className='text-sm text-white'>HyunJinNo</p>
        <div className='flex flex-row items-center gap-3'>
          {isCameraOn ? (
            <VideoCameraIcon
              className='cursor-pointer fill-slate-200 hover:fill-white'
              onClick={() => setIsCameraOn(false)}
            />
          ) : (
            <VideoCameraSlashIcon
              className='cursor-pointer fill-slate-200 hover:fill-white'
              onClick={() => setIsCameraOn(true)}
            />
          )}
          {isAudioOn ? (
            <FaMicrophone
              className='cursor-pointer text-slate-200 hover:text-white'
              size='1.25rem'
              onClick={() => setIsAudioOn(false)}
            />
          ) : (
            <FaMicrophoneSlash
              className='scale-125 cursor-pointer text-slate-200 hover:text-white'
              size='1.25rem'
              onClick={() => setIsAudioOn(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
