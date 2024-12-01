'use client';

import { useSocketStore } from '@/stores/socketStore';
import { FormEvent, useState } from 'react';

export const useChattingForm = (roomId: string) => {
  const { socket } = useSocketStore();
  const [message, setMessage] = useState('');
  const [isMafiaOnly, setIsMafiaOnly] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (message.trim() === '') {
      return;
    }

    if (isMafiaOnly) {
      socket?.emit('send-mafia', { roomId, message });
    } else {
      socket?.emit('send-chat', { roomId, message });
    }
    setMessage('');
  };

  return {
    message,
    isMafiaOnly,
    setMessage,
    handleSubmit,
    setIsMafiaOnly,
  };
};
