'use client';

import LottieFile from '@/../public/lottie/global.json';
import Lottie from 'lottie-react';
import * as motion from 'framer-motion/client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 300) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={`${pathname === '/' && !isScrolled ? 'bg-slate-600/50' : 'bg-transparent'} ${pathname === '/' ? 'h-[37.5rem]' : 'h-20'} flex w-[80rem] flex-col rounded-b-[11.25rem] px-24 transition-all duration-500`}
    >
      <motion.div
        className={`${pathname === '/' && !isScrolled ? 'bg-transparent' : 'bg-slate-600/50'} fixed top-0 z-10 flex h-20 w-[80rem] flex-row items-center justify-between self-center rounded-b-3xl px-24`}
        initial={{ translateY: '-0.5rem', opacity: 0 }}
        whileInView={{ translateY: '0rem', opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Link href='/'>
          <Image
            src='/common/mafiacamp-logo-large.png'
            alt='mafiacamp-logo-large'
            width={184}
            height={36}
          />
        </Link>
        <nav>
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
              <Link
                className={`${pathname === '/signin' ? 'font-semibold text-white' : 'hover:text-white'}`}
                href='/signin'
              >
                로그인
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>
      {pathname === '/' && !isScrolled && (
        <div className='mt-20 flex flex-row items-center gap-10'>
          <div className='flex flex-col gap-24 pt-20'>
            <motion.h1
              className='text-5xl text-white'
              initial={{ translateY: '0.5rem', opacity: 0 }}
              whileInView={{ translateY: '0rem', opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p>누구나 즐길 수 있는</p>
              <p>마피아 게임,</p>
              <p className='font-bold'>MafiaCamp</p>
            </motion.h1>
            <motion.button
              className='h-[3.75rem] w-[11.25rem] rounded-2xl bg-white font-bold text-slate-800 hover:bg-slate-800 hover:text-white'
              initial={{ translateY: '0.5rem', opacity: 0 }}
              whileInView={{ translateY: '0rem', opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              QUICK START
            </motion.button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Lottie animationData={LottieFile} className='h-[22.5rem]' />
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;
