import LobbyViewer from '@/components/lobby/LobbyViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로비',
  description: 'MafiaCamp의 로비 페이지',
  keywords: [
    'MafiaCamp',
    '마피아 캠프',
    '마피아캠프',
    '마피아',
    '실시간',
    '화상 채팅',
    '화상',
    '게임',
    '로비',
  ],
};

export default function Page() {
  return <LobbyViewer />;
}
