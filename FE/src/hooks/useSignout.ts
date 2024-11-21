import { useSocketStore } from '@/stores/socketStore';
import { useRouter } from 'next/navigation';

export const useSignout = () => {
  const { nickname, setState } = useSocketStore();
  const router = useRouter();

  const handleSignout = async () => {
    const response = await fetch('/api/signout/admin', { method: 'POST' });
    if (!response.ok) {
      alert('로그아웃에 실패하였습니다.');
      throw new Error(response.statusText);
    }

    setState({ nickname: '' });
    router.replace('/');
    router.refresh();
  };

  return { nickname, handleSignout };
};
