'use client';

import { useAuthStore } from '@/stores/authStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useSocketStore } from '@/stores/socketStore';
import { GamePublisher } from '@/types/gamePublisher';

interface InvalidityButtonProps {
  roomId: string;
  gamePublisher: GamePublisher;
  target: string | null;
  invalidityCount: number;
  setTarget: (nickname: string | null) => void;
}

const InvalidityButton = ({
  roomId,
  gamePublisher,
  target,
  invalidityCount,
  setTarget,
}: InvalidityButtonProps) => {
  const { isOpen } = useSidebarStore();
  const { nickname } = useAuthStore();
  const { socket } = useSocketStore();

  const handleInvalityButtonClick = () => {
    if (target !== null) {
      socket?.emit('cancel-vote-candidate', {
        roomId,
        from: nickname,
        to: target,
      });
    }

    if (target === 'INVALIDITY') {
      setTarget(null);
      return;
    }

    socket?.emit('vote-candidate', {
      roomId,
      from: nickname,
      to: 'INVALIDITY',
    });

    setTarget('INVALIDITY');
  };

  return (
    <div
      className={[
        `${isOpen ? 'right-[21.5rem]' : 'right-6'}`,
        'fixed bottom-3 z-20 h-16 w-40 transition-all duration-500 ease-out',
      ].join(' ')}
    >
      <button
        className={[
          `${target === 'INVALIDITY' ? 'border-2 bg-slate-600 text-white' : 'bg-white font-bold text-slate-800'}`,
          `${gamePublisher.isAlive ? 'hover:bg-slate-600 hover:text-white' : 'cursor-default'}`,
          'h-full w-full rounded-2xl border border-slate-400 font-bold',
        ].join(' ')}
        onClick={handleInvalityButtonClick}
        disabled={!gamePublisher.isAlive}
      >
        {`기권 ${invalidityCount}`}
      </button>
    </div>
  );
};

export default InvalidityButton;
