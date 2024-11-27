import { GameStatus } from '@/constants/gameStatus';
import { Situation } from '@/constants/situation';
import { GamePublisher } from '@/types/gamePublisher';

interface VideoFilterProps {
  gameStatus: GameStatus;
  gamePublisher: GamePublisher;
  situation: Situation | null;
}

const VideoFilter = ({
  gameStatus,
  gamePublisher,
  situation,
}: VideoFilterProps) => {
  if (
    gameStatus === 'RUNNING' &&
    gamePublisher.isAlive &&
    (situation === 'VOTE' ||
      situation === 'ARGUMENT' ||
      (situation === 'MAFIA' && gamePublisher.role === 'MAFIA') ||
      (situation === 'DOCTOR' && gamePublisher.role === 'DOCTOR') ||
      (situation === 'POLICE' && gamePublisher.role === 'POLICE'))
  ) {
    return (
      <div className='pointer-events-none absolute bottom-0 left-0 z-10 h-full w-full bg-slate-800/75' />
    );
  }

  return null;
};

export default VideoFilter;
