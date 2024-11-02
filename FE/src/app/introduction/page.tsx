'use client';

import LottieFile from '@/../public/lottie/500.json';
import Lottie from 'lottie-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div className='flex w-full flex-col items-center pt-9'>
      <Lottie animationData={LottieFile} />
      <div className='flex flex-col items-center'>
        <h2 className='text-3xl font-bold text-white'>
          앗... 오류가 발생하였습니다.
        </h2>
        <div className='flex flex-col items-center pt-4 text-slate-100'>
          <p>시스템에 오류가 발생하였습니다.</p>
          <p>잠시 후에 다시 시도해 주세요. </p>
        </div>
        <div className='mt-12 flex flex-row items-center gap-4'>
          <Link
            className='d flex h-10 w-[7.5rem] items-center justify-center rounded-3xl bg-white text-slate-800 hover:scale-105'
            href='/'
          >
            홈으로
          </Link>
          <button
            className='flex h-10 w-40 items-center justify-center rounded-3xl bg-slate-600/50 text-white hover:scale-105'
            onClick={() => router.back()}
          >
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
