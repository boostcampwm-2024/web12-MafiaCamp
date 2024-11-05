'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/game')) {
    return null;
  }

  return (
    <footer className='mt-20 flex w-full justify-center bg-slate-600/50 px-12 max-[768px]:px-6'>
      <div className='flex h-full w-[67.5rem] flex-col gap-5 pb-12 pt-7'>
        <Image
          src='/common/mafiacamp-logo-small.png'
          alt='mafiacamp-logo-small'
          width={123}
          height={24}
        />
        <p className='text-sm text-slate-200'>
          <span className='font-bold text-slate-100'>MafiaCamp</span>는 누구나
          즐길 수 있는 온라인 화상 마피아 게임입니다.
        </p>
        <div className='flex flex-row items-center justify-between'>
          <button className='h-10 w-[7.5rem] rounded-2xl bg-white text-sm font-bold text-slate-800 hover:scale-105'>
            START
          </button>
          <div className='flex flex-row items-center gap-5'>
            <button className='h-10 w-10 rounded-full hover:scale-105'>
              <Image
                className='rounded-full'
                src='/common/kakao-talk-icon.png'
                alt='kakao-talk-icon'
                width={40}
                height={40}
              />
            </button>
            <button className='flex h-10 w-10 items-center justify-center rounded-full bg-white hover:scale-105'>
              <Image
                src='/common/google-icon.png'
                alt='google-icon'
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
        <div className='flex flex-row items-center justify-between gap-3 text-sm text-slate-200 max-[768px]:flex-col'>
          <p>Copyright MafiaCamp. All rights reserved</p>
          <div className='flex flex-row items-center gap-10'>
            <Link className='hover:text-white' href='terms'>
              이용 약관
            </Link>
            <Link className='hover:text-white' href='privacy'>
              개인정보 처리방침
            </Link>
            <Link className='hover:text-white' href='introduction'>
              서비스 소개
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
