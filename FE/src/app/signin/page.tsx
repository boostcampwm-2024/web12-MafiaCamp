import SigninPanel from '@/components/signin/SigninPanel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
  description: 'MafiaCamp의 로그인 페이지',
  keywords: [
    'MafiaCamp',
    '마피아 캠프',
    '마피아캠프',
    '마피아',
    '실시간',
    '화상 채팅',
    '화상',
    '게임',
    '로그인',
  ],
};

export default function Page() {
  return (
    <div className='flex w-full flex-col items-center px-6 pt-20'>
      <SigninPanel />
    </div>
  );
}
