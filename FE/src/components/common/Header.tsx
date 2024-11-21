'use client';

import LottieFile from '@/../public/lottie/global.json';
import Lottie from 'lottie-react';
import * as motion from 'framer-motion/client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineMenu } from 'react-icons/md';
import HeaderSidebar from './HeaderSidebar';
import { useSignout } from '@/hooks/useSignout';
import { useSocketStore } from '@/stores/socketStore';
import { User } from '@/types/user';

const Header = () => {
  const { nickname, handleSignout } = useSignout();
  const { setState } = useSocketStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const handleScroll = () => {
    if (window.scrollY >= 300) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/user/info', { method: 'GET' });

      if (!response.ok) {
        return;
      }

      const result: User = await response.json();
      setState({ nickname: result.nickname });
    })();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setState]);

  if (pathname.startsWith('/game')) {
    return null;
  }

  return (
    <header
      className={`${pathname === '/' && !isScrolled ? 'bg-slate-600/50' : 'bg-transparent'} ${pathname === '/' ? 'h-[37.5rem] max-[1080px]:h-[45rem]' : 'h-20'} flex w-[80rem] flex-col rounded-b-[11.25rem] px-24 pb-6 transition-all duration-500 max-[1280px]:w-full max-[1024px]:px-6`}
    >
      <HeaderSidebar visible={isVisible} close={() => setIsVisible(false)} />
      <motion.div
        className={`${pathname === '/' && !isScrolled ? 'bg-transparent' : 'bg-slate-600/50'} fixed top-0 z-10 flex h-20 w-[80rem] flex-row items-center justify-between self-center rounded-b-3xl px-24 max-[1280px]:w-full max-[1280px]:px-12 max-[768px]:px-6`}
        initial={{ y: '-0.5rem', opacity: 0 }}
        animate={{ y: '0rem', opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link href='/'>
          <Image
            src='/common/mafiacamp-logo-large.png'
            alt='mafiacamp-logo-large'
            width={184}
            height={36}
          />
        </Link>
        <nav className='max-[768px]:hidden'>
          <ul className='flex flex-row items-center gap-10 text-slate-200'>
            <li>
              <Link
                className={`${pathname === '/' ? 'font-semibold text-white' : 'hover:text-white'}`}
                href='/'
              >
                홈
              </Link>
            </li>
            <li>
              <Link
                className={`${pathname === '/lobby' ? 'font-semibold text-white' : 'hover:text-white'}`}
                href='/lobby'
              >
                로비
              </Link>
            </li>
            <li>
              {nickname === '' ? (
                <Link
                  className={`${pathname === '/signin' ? 'font-semibold text-white' : 'hover:text-white'}`}
                  href='/signin'
                >
                  로그인
                </Link>
              ) : (
                <button className='hover:text-white' onClick={handleSignout}>
                  로그아웃
                </button>
              )}
            </li>
          </ul>
        </nav>
        <MdOutlineMenu
          className='hidden cursor-pointer text-slate-200 hover:text-white max-[768px]:block'
          size='2rem'
          onClick={() => setIsVisible(true)}
        />
      </motion.div>
      {pathname === '/' && !isScrolled && (
        <div className='mt-20 flex flex-row items-center justify-between max-[1080px]:flex-col max-[1080px]:gap-6 max-[768px]:h-[40rem]'>
          <div className='flex flex-col gap-24 pt-20 max-[1080px]:flex-row max-[1080px]:gap-6 max-[786px]:flex-col max-[768px]:items-center'>
            <motion.h1
              className='flex flex-col text-nowrap text-4xl text-white max-[768px]:items-center max-[768px]:text-3xl'
              initial={{ y: '0.5rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p>누구나 즐길 수 있는</p>
              <p>마피아 게임,</p>
              <p className='font-sans text-5xl font-bold max-[768px]:text-4xl'>
                MafiaCamp
              </p>
            </motion.h1>
            <motion.button
              className='h-[3.75rem] w-[11.25rem] rounded-2xl bg-white font-bold text-slate-800 hover:bg-slate-800 hover:text-white max-[768px]:h-12 max-[768px]:w-36 max-[768px]:text-sm'
              initial={{ y: '0.5rem', opacity: 0 }}
              animate={{ y: '0rem', opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={() => alert('TODO: 구현 예정')}
            >
              QUICK START
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Lottie
              animationData={LottieFile}
              className='h-[22.5rem] max-[768px]:h-full'
            />
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;
