'use client';

import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';
import { useConnectedUserList } from './useConnectedUserList';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export const useAutoSignin = () => {
  const { userId, nickname, initializeAuthState, setAuthState } =
    useAuthStore();
  const { socket, setSocketState } = useSocketStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useConnectedUserList();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const response = await fetch('/api/user/info', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        setLoading(false);
        initializeAuthState();
        return;
      }

      const result: { userId: string; nickname: string | null } =
        await response.json();

      if (result.nickname === null) {
        if (localStorage.getItem(result.userId) === null) {
          // 다른 컴퓨터에서 로그인 시도한 경우 쿠키 삭제
          await fetch('/api/cookie', { method: 'POST', cache: 'no-store' });
          router.refresh();
        } else {
          // 같은 브라우저의 탭을 연 경우
          alert('다른 탭에서 같은 계정으로 로그인한 상태입니다.');
          window.history.back();
        }
        return;
      }

      setAuthState({ userId: result.userId, nickname: result.nickname });
      setLoading(false);
      router.refresh();
    })();
  }, [initializeAuthState, router, setAuthState]);

  useEffect(() => {
    if (userId !== '' && !socket) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`, {
        transports: ['websocket', 'polling'], // use WebSocket first, if available
        withCredentials: true,
      });

      setSocketState({ socket: newSocket });

      newSocket.on('connect_error', (error) => {
        console.error(`연결 실패: ${error}`);
        alert('서버와의 연결에 실패하였습니다. 잠시 후에 다시 시도해 주세요.');
        newSocket.disconnect();
        setSocketState({ socket: null });
        router.replace('/');
      });
    }
  }, [router, setSocketState, socket, userId]);

  return {
    nickname,
    loading,
  };
};
