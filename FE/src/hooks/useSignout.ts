import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';
import { useRouter } from 'next/navigation';

export const useSignout = () => {
  const { initializeAuthState } = useAuthStore();
  const { socket, initializeSocketState } = useSocketStore();
  const router = useRouter();

  const handleSignout = async () => {
    const response = await fetch('/api/signout/admin', {
      method: 'POST',
      cache: 'no-store',
    });
    if (!response.ok) {
      alert('로그아웃에 실패하였습니다.');
      throw new Error(response.statusText);
    }

    socket?.disconnect();
    initializeAuthState();
    initializeSocketState();
    router.replace('/');
  };

  return { handleSignout };
};
