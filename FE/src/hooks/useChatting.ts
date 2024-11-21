'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import { useSocketStore } from '@/stores/socketStore';
import { Chat } from '@/types/chat';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

export const useChatting = (roomId: string, isMafia: boolean) => {
  // TODO: reducer로 변경하기
  const { isOpen, initialize, closeSidebar } = useSidebarStore();
  const { nickname, socket } = useSocketStore();
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [message, setMessage] = useState('');
  const [isMafiaOnly, setIsMafiaOnly] = useState(false);
  const capacity = useSearchParams().get('capacity');
  const chatListRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scroll({
        top: chatListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatList]);

  useEffect(() => {
    socket?.on('chat', (chat: Chat) => {
      setChatList([...chatList, chat]);
    });

    if (isMafia) {
      socket?.on('chat-mafia', (chat: Chat) => {
        setChatList([...chatList, chat]);
      });
    }

    return () => {
      socket?.off('chat');
      socket?.off('chat-mafia');
      initialize();
    };
  }, [chatList, initialize, isMafia, socket]);

  return {
    isOpen,
    nickname,
    capacity,
    chatList,
    message,
    isMafiaOnly,
    chatListRef,
    closeSidebar,
    setMessage,
    handleSubmit,
    setIsMafiaOnly,
  };
};
