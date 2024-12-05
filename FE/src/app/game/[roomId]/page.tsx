import GameViewer from '@/components/game/GameViewer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;

  return {
    title: `게임 - ${roomId}`,
    description: 'MafiaCamp의 게임방',
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
}

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;

  return <GameViewer roomId={roomId} />;
}
