import ChattingList from '@/components/lobby/room/ChattingList';
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
    <div className='flex flex-row items-center justify-between'>
      <h1 className='fixed left-4 top-4 text-5xl text-white'>{id}</h1>
      <Link
        className='fixed left-4 top-20 flex h-10 w-20 items-center justify-center rounded-full bg-white text-slate-800 hover:scale-105'
        href='/lobby'
      >
        나가기
      </Link>
      <ChattingList />
    </div>
  );
}
