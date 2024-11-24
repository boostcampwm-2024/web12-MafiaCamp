'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useSocketStore } from '@/stores/socketStore';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import { Situation } from '@/constants/situation';
import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface VideoViewerProps {
  roomId: string;
  isGameStarted: boolean;
  gamePublisher: GamePublisher;
  gameSubscribers: GameSubscriber[];
  situation: Situation | null;
  target: string | null;
  invalidityCount: number;
  setTarget: (nickname: string | null) => void;
}

const VideoViewer = ({
  roomId,
  isGameStarted,
  gamePublisher,
  gameSubscribers,
  situation,
  target,
  invalidityCount,
  setTarget,
}: VideoViewerProps) => {
  const { isOpen } = useSidebarStore();
  const { nickname } = useAuthStore();
  const { socket } = useSocketStore();
  const {
    listRef,
    onDragStart,
    onDragMove,
    onDragEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useDragScroll();

  const totalSurvivors = useMemo(
    () =>
      isGameStarted
        ? (gamePublisher.isAlive ? 1 : 0) +
          gameSubscribers.reduce(
            (total, gameSubscriber) => total + (gameSubscriber.isAlive ? 1 : 0),
            0,
          )
        : gameSubscribers.length + 1,
    [gamePublisher.isAlive, gameSubscribers, isGameStarted],
  );

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
        'absolute bottom-[6.5rem] left-6 top-6 max-h-screen overflow-auto transition-all duration-500 ease-out',
      ].join(' ')}
      ref={listRef}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {
        gamePublisher.isAlive &&
          /* eslint-disable indent */
          (situation === 'VOTE' ||
            situation === 'ARGUMENT' ||
            (situation === 'MAFIA' && gamePublisher.role === 'MAFIA') ||
            (situation === 'DOCTOR' && gamePublisher.role === 'DOCTOR') ||
            (situation === 'POLICE' && gamePublisher.role === 'POLICE')) && (
            <div className='pointer-events-none absolute bottom-0 left-0 z-10 h-full w-full bg-slate-800/75' />
          )
        /* eslint-enable indent */
      }
      {gamePublisher.isAlive && situation === 'VOTE' && (
        <div
          className={[
            `${isOpen ? 'right-[21.5rem]' : 'right-6'}`,
            'fixed bottom-3 z-20 h-20 w-40 transition-all duration-500 ease-out',
          ].join(' ')}
        >
          <button
            className={[
              `${target === 'INVALIDITY' ? 'border-2 bg-slate-600 text-white' : 'bg-white font-bold text-slate-800'}`,
              'h-full w-full rounded-2xl border border-slate-400 font-bold hover:bg-slate-600 hover:text-white',
            ].join(' ')}
            onClick={handleInvalityButtonClick}
          >
            {`기권 ${invalidityCount}`}
          </button>
        </div>
      )}
      <div
        className={[
          `${totalSurvivors <= 2 ? 'grid-rows-1' : 'grid-rows-2'}`,
          `${totalSurvivors <= 4 ? 'grid-cols-2' : totalSurvivors <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`,
          'grid h-full min-w-[67.5rem] gap-6',
        ].join(' ')}
      >
        {(!isGameStarted || gamePublisher.isAlive) && (
          <VideoItem
            roomId={roomId}
            isPublisherAlive={gamePublisher.isAlive}
            gamePublisherRole={gamePublisher.role}
            gameParticipant={gamePublisher}
            situation={situation}
            target={target}
            setTarget={setTarget}
          />
        )}
        {gameSubscribers
          .filter((gameSubscriber) => !isGameStarted || gameSubscriber.isAlive)
          .map((gameSubscriber) => (
            <VideoItem
              key={gameSubscriber.nickname}
              roomId={roomId}
              isPublisherAlive={gamePublisher.isAlive}
              gamePublisherRole={gamePublisher.role}
              gameParticipant={gameSubscriber}
              situation={situation}
              target={target}
              setTarget={setTarget}
            />
          ))}
      </div>
    </div>
  );
};

export default VideoViewer;