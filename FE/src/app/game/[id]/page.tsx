import Bottombar from '@/components/game/Bottombar';
import ChattingList from '@/components/game/ChattingList';
import VideoViewer from '@/components/game/VideoViewer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return {
    title: `게임 - ${id}`,
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

export default function Page() {
  return (
    <div>
      <VideoViewer />
      <Bottombar />
      <ChattingList />
    </div>
  );
}
