import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import Background from '@/components/common/Background';
import Header from '@/components/common/Header';
import FloatingButton from '@/components/common/FloatingButton';
import Footer from '@/components/common/Footer';

const notoSansKr = Noto_Sans_KR({ weight: ['500'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: 'MafiaCamp | %s',
    default: 'MafiaCamp - 온라인 화상 마피아 게임',
  },
  description: 'MafiaCamp는 누구나 즐길 수 있는 온라인 화상 마피아 게임입니다.',
  keywords: [
    'MafiaCamp',
    '마피아 캠프',
    '마피아캠프',
    '마피아',
    '실시간',
    '화상 채팅',
    '화상',
    '게임',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${notoSansKr.className} flex flex-col items-center`}>
        <Background />
        <Header />
        {children}
        <Footer />
        <FloatingButton />
      </body>
    </html>
  );
}
