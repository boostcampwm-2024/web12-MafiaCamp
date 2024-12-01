'use client';

import { TOAST_OPTION } from '@/constants/toastOption';
import { AccountCreateFormSchema } from '@/libs/zod/accountCreateFormSchema';
import { useAuthStore } from '@/stores/authStore';
import { AuthAdmin } from '@/types/authAdmin';
import { User } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const useAuthForm = () => {
  const { setAuthState } = useAuthStore();
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const methods = useForm<AuthAdmin>({
    resolver: zodResolver(AccountCreateFormSchema),
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      oAuthId: '',
    },
    mode: 'onChange',
  });

  const notifySuccess = (message: string) => {
    toast.success(message, TOAST_OPTION);
  };

  const notifyError = (message: string) => {
    toast.error(message, TOAST_OPTION);
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await methods.trigger(['email', 'password']);
    if (methods.formState.errors.email && methods.formState.errors.password) {
      return;
    }

    setLoading(true);

    const response = await fetch('/api/signin/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: methods.getValues('email'),
        password: methods.getValues('password'),
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      setLoading(false);
      notifyError(await response.text());
      throw new Error(response.statusText);
    }

    const result: User = await response.json();
    localStorage.setItem(result.userId, result.nickname);
    setAuthState({ ...result });
    router.replace('/');
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await methods.trigger();
    if (!methods.formState.isValid) {
      return;
    }

    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...methods.getValues(),
        }),
        cache: 'no-store',
      },
    );

    setLoading(false);

    if (!response.ok) {
      notifyError('이미 존재하는 계정입니다.');
      throw new Error(response.statusText);
    }

    notifySuccess('회원가입에 성공하였습니다.');
    setIsSignIn(true);
  };

  return {
    methods,
    isSignIn,
    loading,
    setIsSignIn,
    handleSignIn,
    handleSignUp,
  };
};
