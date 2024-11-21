import AdminPanel from '@/components/signin/AdminPanel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 로그인',
  description: 'MafiaCamp의 관리자 로그인 페이지',
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
    '관리자',
  ],
};

export default function Page() {
  return (
    <div className='flex w-full flex-col items-center pt-20'>
      <AdminPanel />
    </div>
  );
}
