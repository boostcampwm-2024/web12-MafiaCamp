import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';
import { useRouter } from 'next/navigation';

export const useSignout = () => {
  const { userId, initializeAuthState } = useAuthStore();
  const { socket, initializeSocketState } = useSocketStore();
  const router = useRouter();

  const handleSignout = async () => {
    const response = await fetch('/api/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
      cache: 'no-store',
    });
    if (!response.ok) {
      alert('로그아웃에 실패하였습니다.');
      throw new Error(response.statusText);
    }

    localStorage.removeItem(userId);
    socket?.disconnect();
    initializeAuthState();
    initializeSocketState();
    router.replace('/');
  };

  return { handleSignout };
};
