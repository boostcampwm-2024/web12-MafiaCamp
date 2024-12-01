'use client';

import { useAuthStore } from '@/stores/authStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useSocketStore } from '@/stores/socketStore';
import { Chat, ChatResponse } from '@/types/chat';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

export const useChatting = (roomId: string, isMafia: boolean) => {
  const { isOpen, initializeSidebarState, closeSidebar } = useSidebarStore();
  const { nickname } = useAuthStore();
  const { socket } = useSocketStore();
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [message, setMessage] = useState('');
  const [isMafiaOnly, setIsMafiaOnly] = useState(false);
  const searchParams = useSearchParams();
  const roomName = searchParams.get('roomName');
  const capacity = searchParams.get('capacity');
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
    socket?.on('chat', (chat: ChatResponse) => {
      setChatList([...chatList, { ...chat, isMafiaOnly: false }]);
    });

    if (isMafia) {
      socket?.on('chat-mafia', (chat: ChatResponse) => {
        setChatList([...chatList, { ...chat, isMafiaOnly: true }]);
      });
    }

    return () => {
      socket?.off('chat');
      socket?.off('chat-mafia');
      initializeSidebarState();
    };
  }, [chatList, initializeSidebarState, isMafia, socket]);

  return {
    isOpen,
    nickname,
    roomName,
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
