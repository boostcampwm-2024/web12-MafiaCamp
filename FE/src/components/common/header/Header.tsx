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
import { User } from '@/types/user';
import ProfileModal from './ProfileModal';
import { useAuthStore } from '@/stores/authStore';
import { FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const { userId, initializeAuthState, setAuthState } = useAuthStore();
  const { nickname, handleSignout } = useSignout();
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerSidebarVisible, setHeaderSidebarVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
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
      const response = await fetch('/api/user/info', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        initializeAuthState();
        return;
      }

      const result: User = await response.json();
      setAuthState({ ...result });
    })();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initializeAuthState, setAuthState]);

  if (
    pathname.startsWith('/game') ||
    pathname.startsWith('/login/kakao/callback')
  ) {
    return null;
  }

  return (
    <header
      className={`${pathname === '/' && !isScrolled ? 'bg-slate-600/50' : 'bg-transparent'} ${pathname === '/' ? 'h-[37.5rem] max-[1080px]:h-[45rem]' : 'h-20'} flex w-[80rem] flex-col rounded-b-[11.25rem] px-24 pb-6 transition-all duration-500 max-[1280px]:w-full max-[1024px]:px-6`}
    >
      <HeaderSidebar
        visible={headerSidebarVisible}
        closeHeaderSidebar={() => setHeaderSidebarVisible(false)}
      />
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
              {userId === '' ? (
                <div className='h-6 w-12 animate-pulse rounded-lg bg-slate-400' />
              ) : nickname === '' ? (
                <Link
                  className={`${pathname === '/signin' ? 'font-semibold text-white' : 'hover:text-white'}`}
                  href='/signin'
                >
                  로그인
                </Link>
              ) : (
                <div
                  className='relative flex items-center gap-1 rounded-xl px-2 py-1 hover:bg-slate-600'
                  onMouseEnter={() => setProfileModalVisible(true)}
                  onMouseLeave={() => setProfileModalVisible(false)}
                >
                  <p className='max-w-44 truncate text-nowrap'>{nickname}</p>
                  <FaChevronDown />
                  {profileModalVisible && (
                    <ProfileModal
                      closeModal={() => setProfileModalVisible(false)}
                      handleSignout={() => {
                        setProfileModalVisible(false);
                        handleSignout();
                      }}
                    />
                  )}
                </div>
              )}
            </li>
          </ul>
        </nav>
        <MdOutlineMenu
          className='hidden cursor-pointer text-slate-200 hover:text-white max-[768px]:block'
          size='2rem'
          onClick={() => setHeaderSidebarVisible(true)}
        />
      </motion.div>
      {pathname === '/' && !isScrolled && (
        <div className='mt-20 flex flex-row items-center justify-between max-[1080px]:flex-col max-[1080px]:gap-6 max-[768px]:h-[40rem]'>
          <div className='flex flex-col gap-24 pt-20 max-[1080px]:flex-row max-[1080px]:gap-6 max-[768px]:flex-col max-[768px]:items-center'>
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
            <Link href='/lobby'>
              <motion.div
                className='flex h-[3.75rem] w-[11.25rem] items-center justify-center rounded-2xl bg-white font-bold text-slate-800 hover:bg-slate-800 hover:text-white max-[768px]:h-12 max-[768px]:w-36 max-[768px]:text-sm'
                initial={{ y: '0.5rem', opacity: 0 }}
                animate={{ y: '0rem', opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                게임 시작하기
              </motion.div>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Lottie
              className='h-[22.5rem] max-[768px]:h-full'
              animationData={LottieFile}
            />
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;
