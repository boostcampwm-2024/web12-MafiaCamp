'use client';

import { useRef } from 'react';

export const useThrottle = <T extends unknown[]>(
  callback: (...params: T) => void,
  throttleTime = 1000,
) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: T) => {
    if (timeout.current) {
      return;
    }

    callback(...args);

    timeout.current = setTimeout(() => {
      timeout.current = null;
    }, throttleTime);
  };
};
