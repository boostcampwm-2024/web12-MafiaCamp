'use client';

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
          alert('로그인에 실패하였습니다.');
          console.error(response.statusText);
          return router.replace('/signin');
        }

        const result: User = await response.json();
        setAuthState({ ...result });
        router.replace('/');
      })();
    }
  }, [code, router, setAuthState]);

  return null;
};

export default AuthLoading;
