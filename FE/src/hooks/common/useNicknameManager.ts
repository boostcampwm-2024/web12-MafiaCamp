'use client';

import { TOAST_OPTION } from '@/constants/toastOption';
import { NicknameChangeFormSchema } from '@/libs/zod/nicknameChangeFormSchema';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const useNicknameManager = (closeModal: () => void) => {
  const { userId, nickname, setAuthState } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const methods = useForm<{ newNickname: string }>({
    resolver: zodResolver(NicknameChangeFormSchema),
    defaultValues: {
      newNickname: nickname,
    },
    mode: 'onChange',
  });

  const notifyError = (message: string) => {
    toast.error(message, TOAST_OPTION);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await methods.trigger();
    if (!methods.formState.isValid) {
      return;
    }

    setLoading(true);

    const response = await fetch('/api/user/nickname', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        nickname: methods.getValues('newNickname'),
      }),
      cache: 'no-store',
    });

    setLoading(false);

    if (!response.ok) {
      notifyError(await response.text());
      return;
    }

    localStorage.setItem(userId, methods.getValues('newNickname'));
    setAuthState({ nickname: methods.getValues('newNickname') });
    closeModal();
  };

  return { methods, loading, handleSubmit };
};
