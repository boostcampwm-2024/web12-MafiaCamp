'use client';

import LottieFile from '@/../public/lottie/pulse.json';
import Lottie from 'lottie-react';
import { User } from '@/types/user';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const AuthLoading = () => {
  const { setAuthState } = useAuthStore();
  const code = useSearchParams().get('code');
  const router = useRouter();

  useEffect(() => {
    if (code) {
      (async () => {
        const response = await fetch(`/api/signin/kakao?code=${code}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          alert('로그인에 실패하셨습니다.');
          console.error(response.statusText);
          return router.replace('/signin');
        }

        const result: User = await response.json();
        setAuthState({ ...result });
        router.replace('/');
      })();
    }
  }, [code, router, setAuthState]);

  return (
    <div className='fixed left-0 top-0 flex h-full w-full items-center justify-center'>
      <Lottie className='w-1/2' animationData={LottieFile} />
    </div>
  );
};

export default AuthLoading;
