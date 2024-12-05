'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import { RiNotionFill } from 'react-icons/ri';

const Footer = () => {
  const pathname = usePathname();

  if (
    pathname.startsWith('/game') ||
    pathname.startsWith('/login/kakao/callback')
  ) {
    return null;
  }

  return (
    <footer className='mt-20 flex w-full justify-center bg-slate-600/50 px-12 max-[768px]:px-6'>
      <div className='flex h-full w-[67.5rem] flex-col pb-12 pt-8'>
        <Image
          src='/common/mafiacamp-logo-large.png'
          alt='mafiacamp-logo-large'
          width={184}
          height={36}
        />
        <p className='mt-6 text-sm text-slate-200 max-[768px]:self-center max-[768px]:pb-2'>
          <span className='text-white'>MafiaCamp</span>는 누구나 즐길 수 있는
          온라인 화상 마피아 게임입니다.
        </p>
        <div className='flex flex-row items-center justify-between gap-3 text-sm text-slate-200 max-[768px]:flex-col'>
          <p>© 2024 MafiaCamp. All rights reserved.</p>
          <div className='flex flex-row items-center gap-5'>
            <a
              className='flex h-10 w-10 items-center justify-center rounded-full bg-white hover:scale-105'
              href='https://broken-bubble-48c.notion.site/web12-MafiaCamp-db7e416f79ce4e3e9a7d6c0f60a87c3f'
              aria-label='A link to notion page'
            >
              <RiNotionFill className='text-slate-900' size='1.75rem' />
            </a>
            <a
              className='flex h-10 w-10 items-center justify-center rounded-full bg-white hover:scale-105'
              href='https://github.com/boostcampwm-2024/web12-MafiaCamp'
              aria-label='A link to gitHub repository'
            >
              <FaGithub className='text-slate-900' size='1.5rem' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
