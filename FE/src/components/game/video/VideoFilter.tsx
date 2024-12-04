import { GameStatus } from '@/constants/gameStatus';
import { GameSituation } from '@/constants/situation';
import { GamePublisher } from '@/types/gamePublisher';

interface VideoFilterProps {
  gameStatus: GameStatus;
  gamePublisher: GamePublisher;
  situation: GameSituation | null;
}

const VideoFilter = ({
  gameStatus,
  gamePublisher,
  situation,
}: VideoFilterProps) => {
  if (
    gameStatus === 'RUNNING' &&
    gamePublisher.isAlive &&
    (situation === 'PRIMARY_VOTE' ||
      situation === 'FINAL_VOTE' ||
      situation === 'ARGUMENT' ||
      (situation === 'MAFIA' && gamePublisher.role === 'MAFIA') ||
      (situation === 'DOCTOR' && gamePublisher.role === 'DOCTOR') ||
      (situation === 'POLICE' && gamePublisher.role === 'POLICE'))
  ) {
    return (
      <div className='pointer-events-none absolute bottom-0 left-0 z-10 h-full w-full min-w-[67.5rem] bg-slate-800/75' />
    );
  }

  return null;
};

export default VideoFilter;
