'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useSocketStore } from '@/stores/socketStore';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import { Situation } from '@/constants/situation';
import { useMemo } from 'react';

interface VideoViewerProps {
  roomId: string;
  isGameStarted: boolean;
  situation: Situation | null;
  gamePublisher: GamePublisher | null;
  gameSubscribers: GameSubscriber[];
  target: string | null;
  invalidityCount: number;
  setTarget: (nickname: string | null) => void;
}

const VideoViewer = ({
  roomId,
  isGameStarted,
  situation,
  gamePublisher,
  gameSubscribers,
  target,
  invalidityCount,
  setTarget,
}: VideoViewerProps) => {
  const { isOpen } = useSidebarStore();
  const { nickname, socket } = useSocketStore();
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
        ? (gamePublisher?.participant ? 1 : 0) +
          gameSubscribers.reduce(
            (total, gameSubscriber) =>
              total + (gameSubscriber.participant ? 1 : 0),
            0,
          )
        : gameSubscribers.length + 1,
    [gamePublisher?.participant, gameSubscribers, isGameStarted],
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
      {(situation === 'VOTE' ||
        (situation === 'POLICE' && gamePublisher?.role === 'POLICE')) && (
        <div className='pointer-events-none absolute bottom-0 left-0 z-10 h-full w-full bg-slate-800/75' />
      )}
      {situation === 'VOTE' && (
        <button
          className={[
            `${target === 'INVALIDITY' ? 'border-2 bg-slate-600 text-white' : 'bg-white font-bold text-slate-800'}`,
            'absolute right-0 top-0 z-20 h-[3.75rem] w-[11.25rem] rounded-2xl border border-slate-400 font-bold hover:bg-slate-600 hover:text-white',
          ].join(' ')}
          onClick={handleInvalityButtonClick}
        >
          {`기권 ${invalidityCount}`}
        </button>
      )}
      <div
        className={[
          `${totalSurvivors <= 2 ? 'grid-rows-1' : 'grid-rows-2'}`,
          `${totalSurvivors <= 4 ? 'grid-cols-2' : totalSurvivors <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`,
          'grid h-full min-w-[67.5rem] gap-6',
        ].join(' ')}
      >
        {(!isGameStarted || gamePublisher?.participant) && (
          <VideoItem
            roomId={roomId}
            playerRole={gamePublisher?.role}
            gameParticipantNickname={nickname}
            gameParticipantRole={gamePublisher?.role}
            gameParticipant={gamePublisher}
            situation={situation}
            target={target}
            setTarget={setTarget}
          />
        )}
        {gameSubscribers
          .filter(
            (gameSubscriber) => !isGameStarted || gameSubscriber.participant,
          )
          .map((gameSubscriber) => (
            <VideoItem
              key={gameSubscriber.nickname}
              roomId={roomId}
              playerRole={gamePublisher?.role}
              gameParticipantNickname={gameSubscriber.nickname}
              gameParticipantRole={gameSubscriber.role}
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
