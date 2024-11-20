'use client';

import 'react-toastify/dist/ReactToastify.css';
import { AccountCreateFormSchema } from '@/libs/zod/accountCreateFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { TOAST_OPTION } from '@/constants/toastOption';

const AdminPanel = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const methods = useForm<{
    email: string;
    nickname: string;
    password: string;
    oAuthId: string;
  }>({
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignIn) {
      await methods.trigger(['email', 'password']);
      if (methods.formState.errors.email && methods.formState.errors.password) {
        return;
      }

      const response = await fetch('/api/login/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: methods.getValues('email'),
          password: methods.getValues('password'),
        }),
      });

      if (!response.ok) {
        notifyError('로그인에 실패하였습니다.');
        throw new Error(response.statusText);
      }

      notifySuccess('로그인에 성공하였습니다.');
    } else {
      await methods.trigger();
      if (!methods.formState.isValid) {
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...methods.getValues(),
          }),
        },
      );

      if (!response.ok) {
        notifyError('회원가입에 실패하였습니다.');
        throw new Error(response.statusText);
      }

      notifySuccess('회원가입에 성공하였습니다.');
      setIsSignIn(true);
    }
  };

  return (
    <div className='flex w-[30rem] flex-col items-center rounded-3xl bg-white p-10 max-[512px]:w-full'>
      <ToastContainer />
      <h2 className='flex items-center gap-x-2 pt-5 text-3xl font-bold text-slate-800 max-[512px]:flex-col max-[400px]:text-xl'>
        Admin {isSignIn ? '로그인' : '회원가입'}
      </h2>
      <div className='mt-8 grid h-10 w-full grid-cols-2 gap-8'>
        <button
          className={`${isSignIn ? 'bg-slate-800' : 'bg-slate-400/50'} w-full rounded-2xl text-white hover:scale-105`}
          onClick={() => {
            methods.reset();
            setIsSignIn(true);
          }}
        >
          로그인
        </button>
        <button
          className={`${isSignIn ? 'bg-slate-400/50' : 'bg-slate-800'} w-full rounded-2xl text-white hover:scale-105`}
          onClick={() => {
            methods.reset();
            setIsSignIn(false);
          }}
        >
          회원가입
        </button>
      </div>
      <form
        className='mt-10 flex w-full flex-col items-center gap-12'
        onSubmit={handleSubmit}
      >
        <div className='flex w-full flex-col items-center gap-10'>
          <div className='relative w-full'>
            <input
              className={`${methods.formState.errors.email ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-sm outline-none ring-1`}
              id='email'
              type='email'
              placeholder='이메일 (최대 30자)'
              {...methods.register('email')}
              maxLength={30}
              autoComplete='off'
              onChange={(e) => {
                methods.setValue('email', e.target.value);
                methods.trigger('email');
              }}
            />
            {methods.formState.errors.email && (
              <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
                {methods.formState.errors.email.message as string}
              </p>
            )}
          </div>
          {!isSignIn && (
            <div className='relative w-full'>
              <input
                className={`${methods.formState.errors.nickname ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-sm outline-none ring-1`}
                id='nickname'
                type='text'
                placeholder='닉네임 (최대 30자)'
                {...methods.register('nickname')}
                maxLength={30}
                autoComplete='off'
                onChange={(e) => {
                  methods.setValue('nickname', e.target.value);
                  methods.trigger('nickname');
                }}
              />
              {methods.formState.errors.nickname && (
                <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
                  {methods.formState.errors.nickname.message as string}
                </p>
              )}
            </div>
          )}
          <div className='relative w-full'>
            <input
              className={`${methods.formState.errors.password ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-sm outline-none ring-1`}
              id='password'
              type='password'
              placeholder='비밀번호'
              {...methods.register('password')}
              maxLength={255}
              autoComplete='off'
              onChange={(e) => {
                methods.setValue('password', e.target.value);
                methods.trigger('password');
              }}
            />
            {methods.formState.errors.password && (
              <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
                {methods.formState.errors.password.message as string}
              </p>
            )}
          </div>
          {!isSignIn && (
            <div className='relative w-full'>
              <input
                className={`${methods.formState.errors.oAuthId ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-sm outline-none ring-1`}
                id='oAuthId'
                type='text'
                placeholder='임시 OAuthId'
                {...methods.register('oAuthId')}
                maxLength={100}
                autoComplete='off'
                onChange={(e) => {
                  methods.setValue('oAuthId', e.target.value);
                  methods.trigger('oAuthId');
                }}
              />
              {methods.formState.errors.oAuthId && (
                <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
                  {methods.formState.errors.oAuthId.message as string}
                </p>
              )}
            </div>
          )}
        </div>
        <button
          className='h-[2.875rem] w-[17.25rem] rounded-3xl bg-slate-800 text-white hover:scale-105'
          type='submit'
        >
          {isSignIn ? '로그인' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
