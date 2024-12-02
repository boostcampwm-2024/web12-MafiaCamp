'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import { useSocketStore } from '@/stores/socketStore';
import { Chat, ChatResponse } from '@/types/chat';
import { useEffect, useRef, useState } from 'react';

export const useChattingList = (isMafia: boolean) => {
  const { socket } = useSocketStore();
  const { initializeSidebarState } = useSidebarStore();
  const [chatList, setChatList] = useState<Chat[]>([]);
  const chattingListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chattingListRef.current) {
      chattingListRef.current.scroll({
        top: chattingListRef.current.scrollHeight,
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

  return { chattingListRef, chatList };
};
