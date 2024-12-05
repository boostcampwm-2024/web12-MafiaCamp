'use client';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AdminInput from './AdminInput';
import { useAuthForm } from '@/hooks/signin/useAuthForm';

const AdminPanel = () => {
  const {
    methods,
    isSignIn,
    loading,
    setIsSignIn,
    handleSignIn,
    handleSignUp,
  } = useAuthForm();

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
        onSubmit={isSignIn ? handleSignIn : handleSignUp}
      >
        <div className='flex w-full flex-col items-center gap-10'>
          <AdminInput
            methods={methods}
            inputId='email'
            inputType='email'
            placeholder='이메일 (최대 30자)'
            maxLength={30}
            fieldError={methods.formState.errors.email}
          />
          {!isSignIn && (
            <AdminInput
              methods={methods}
              inputId='nickname'
              inputType='text'
              placeholder='닉네임 (최대 30자)'
              maxLength={30}
              fieldError={methods.formState.errors.nickname}
            />
          )}
          <AdminInput
            methods={methods}
            inputId='password'
            inputType='password'
            placeholder='비밀번호'
            maxLength={255}
            fieldError={methods.formState.errors.password}
          />
          {!isSignIn && (
            <AdminInput
              methods={methods}
              inputId='oAuthId'
              inputType='text'
              placeholder='임시 OAuthId'
              maxLength={100}
              fieldError={methods.formState.errors.oAuthId}
            />
          )}
        </div>
        <button
          className={[
            `${loading ? 'cursor-wait bg-transparent/10' : 'hover:scale-105'}`,
            'h-[2.875rem] w-[17.25rem] rounded-3xl bg-slate-800 text-white',
          ].join(' ')}
          type='submit'
          disabled={loading}
        >
          {isSignIn ? '로그인' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
