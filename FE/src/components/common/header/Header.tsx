'use client';

import * as motion from 'framer-motion/client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdOutlineMenu } from 'react-icons/md';
import HeaderSidebar from './HeaderSidebar';
import ProfileModal from './ProfileModal';
import { FaChevronDown } from 'react-icons/fa';
import { useAutoSignin } from '@/hooks/common/useAutoSignin';
import { useHeaderController } from '@/hooks/common/useHeaderController';

const Header = () => {
  const { nickname, loading } = useAutoSignin();
  const {
    scrolled,
    headerSidebarVisible,
    profileModalVisible,
    openHeaderSidebar,
    closeHeaderSidebar,
    openProfileModal,
    closeProfileModal,
  } = useHeaderController();
  const pathname = usePathname();

  if (
    pathname.startsWith('/game') ||
    pathname.startsWith('/login/kakao/callback')
  ) {
    return null;
  }

  return (
    <header
      className={[
        `${pathname === '/' && !scrolled ? 'bg-slate-600/50' : 'bg-transparent'}`,
        `${pathname === '/' ? 'h-[37.5rem] max-[1080px]:h-[45rem]' : 'h-20'}`,
        'flex w-[80rem] flex-col rounded-b-[11.25rem] px-24 pb-6 transition-all duration-500 max-[1280px]:w-full max-[1024px]:px-6',
      ].join(' ')}
    >
      <HeaderSidebar
        visible={headerSidebarVisible}
        closeHeaderSidebar={closeHeaderSidebar}
      />
      <motion.div
        className={[
          `${pathname === '/' && !scrolled ? 'bg-transparent' : 'bg-slate-600/50'}`,
          'fixed top-0 z-10 flex h-20 w-[80rem] flex-row items-center justify-between self-center rounded-b-3xl px-24 max-[1280px]:w-full max-[1280px]:px-12 max-[768px]:px-6',
        ].join(' ')}
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
              {loading ? (
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
                  onMouseEnter={openProfileModal}
                  onMouseLeave={closeProfileModal}
                >
                  <p className='max-w-44 truncate text-nowrap'>{nickname}</p>
                  <FaChevronDown />
                  {profileModalVisible && (
                    <ProfileModal closeModal={closeProfileModal} />
                  )}
                </div>
              )}
            </li>
          </ul>
        </nav>
        <MdOutlineMenu
          className='hidden cursor-pointer text-slate-200 hover:text-white max-[768px]:block'
          size='2rem'
          onClick={openHeaderSidebar}
        />
      </motion.div>
      {pathname === '/' && !scrolled && (
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
              <p className='text-5xl font-bold tracking-wide max-[768px]:text-4xl'>
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
            className='flex h-full flex-col justify-end'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            >
              <Image
                src='/common/globe.png'
                alt='globe'
                width={320}
                height={320}
                quality={100}
              />
            </motion.div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;
