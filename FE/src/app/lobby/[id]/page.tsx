import Bottombar from '@/components/lobby/room/Bottombar';
import ChattingList from '@/components/lobby/room/ChattingList';
import VideoViewer from '@/components/lobby/room/VideoViewer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return {
    title: `게임 - ${id}`,
    description: 'MafiaCamp의 게임방',
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
