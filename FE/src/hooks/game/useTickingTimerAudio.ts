'use client';

import { useRef } from 'react';

export const useTickingTimerAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(new Audio('/ticking_timer.mp3'));

  const playSound = () => {
    audioRef.current.play();
  };

  const stopSound = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return { playSound, stopSound };
};
