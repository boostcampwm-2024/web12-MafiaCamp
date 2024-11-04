import ChattingList from '@/components/lobby/room/ChattingList';
import VideoViewer from '@/components/lobby/room/VideoViewer';
import Link from 'next/link';

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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div>
      <div className='fixed left-6 top-6 z-10 bg-blue-100'>
        <h1 className='text-5xl text-white'>{id}</h1>
        <Link
          className='flex h-10 w-20 items-center justify-center rounded-full bg-white text-slate-800 hover:scale-105'
          href='/lobby'
        >
          나가기
        </Link>
      </div>
      <VideoViewer />
      <ChattingList />
    </div>
  );
}
