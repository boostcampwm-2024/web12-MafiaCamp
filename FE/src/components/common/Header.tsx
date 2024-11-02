'use client';

import LottieFile from '@/../public/lottie/global.json';
import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as motion from 'framer-motion/client';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // TODO
  // if (!isScrolled) {
  //   return (
  //     <header className='w-[80rem]'>
  //       <div className='fixed top-0 flex h-[37.5rem] w-[80rem] flex-col rounded-b-[11.25rem] bg-slate-600/50 px-24'>
  //         <motion.div
  //           className='flex h-20 w-full flex-row items-center justify-between'
  //           initial={{ translateY: '-0.5rem', opacity: 0 }}
  //           whileInView={{ translateY: '0rem', opacity: 1 }}
  //           transition={{ delay: 0.5, duration: 0.5 }}
  //           viewport={{ once: true }}
  //         >
  //           <Link href='/'>
  //             <Image
  //               src='/common/mafiacamp-logo-large.png'
  //               alt='mafiacamp-logo-large'
  //               width={184}
  //               height={36}
  //             />
  //           </Link>
  //           <nav>
  //             <ul className='flex flex-row items-center gap-10 text-slate-200'>
  //               <li>
  //                 <Link className='font-semibold text-white' href='/'>
  //                   홈
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link className='hover:text-white' href='/lobby'>
  //                   로비
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link className='hover:text-white' href='auth/signin'>
  //                   로그인
  //                 </Link>
  //               </li>
  //             </ul>
  //           </nav>
  //         </motion.div>
  //         <div className='flex flex-row items-center gap-10'>
  //           <div className='flex flex-col gap-24 pt-20'>
  //             <motion.h1
  //               className='text-5xl text-white'
  //               initial={{ translateY: '0.5rem', opacity: 0 }}
  //               whileInView={{ translateY: '0rem', opacity: 1 }}
  //               transition={{ duration: 0.5 }}
  //               viewport={{ once: true }}
  //             >
  //               <p>누구나 즐길 수 있는</p>
  //               <p>마피아 게임,</p>
  //               <p className='font-bold'>MafiaCamp</p>
  //             </motion.h1>
  //             <motion.button
  //               className='h-[3.75rem] w-[11.25rem] rounded-2xl bg-white font-bold text-slate-800 hover:scale-105'
  //               initial={{ translateY: '0.5rem', opacity: 0 }}
  //               whileInView={{ translateY: '0rem', opacity: 1 }}
  //               transition={{ delay: 0.5, duration: 0.5 }}
  //               viewport={{ once: true }}
  //             >
  //               QUICK START
  //             </motion.button>
  //           </div>
  //           <motion.div
  //             initial={{ opacity: 0 }}
  //             whileInView={{ opacity: 1 }}
  //             transition={{ delay: 1, duration: 0.5 }}
  //             viewport={{ once: true }}
  //           >
  //             <Lottie animationData={LottieFile} className='h-[22.5rem]' />
  //           </motion.div>
  //         </div>
  //       </div>
  //       <div className='h-[37.5rem]' />
  //     </header>
  //   );
  // }

  return (
    <header className='w-[80rem]'>
      <div className='fixed top-0 flex h-20 w-[80rem] flex-row items-center justify-between rounded-b-3xl bg-slate-600/50 px-24'>
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
              <Link className='font-semibold text-white' href='/'>
                홈
              </Link>
            </li>
            <li>
              <Link className='hover:text-white' href='/lobby'>
                로비
              </Link>
            </li>
            <li>
              <Link className='hover:text-white' href='auth/signin'>
                로그인
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className='h-20' />
    </header>
  );
};

export default Header;
