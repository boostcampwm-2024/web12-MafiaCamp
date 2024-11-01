import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className='flex h-20 w-[80rem] flex-row items-center justify-between rounded-b-3xl bg-slate-600/50 px-24'>
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
    </header>
  );
};

export default Header;
