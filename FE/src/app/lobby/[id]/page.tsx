import ChattingList from '@/components/lobby/room/ChattingList';

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
      <ChattingList />
    </div>
  );
}
