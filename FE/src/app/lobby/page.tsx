import LobbyBanner from '@/components/lobby/LobbyBanner';
import LobbyList from '@/components/lobby/LobbyList';

export default function Page() {
  return (
    <div className='flex flex-col items-center'>
      <LobbyBanner />
      <LobbyList />
    </div>
  );
}
