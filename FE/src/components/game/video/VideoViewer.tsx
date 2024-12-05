'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import { useDragScroll } from '@/hooks/utils/useDragScroll';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import { GameSituation } from '@/constants/situation';
import { useMemo } from 'react';
import VideoFilter from './VideoFilter';
import { GameStatus } from '@/constants/gameStatus';
import InvalidityButton from './InvalidityButton';

interface VideoViewerProps {
  roomId: string;
  gameStatus: GameStatus;
  gamePublisher: GamePublisher;
  gameSubscribers: GameSubscriber[];
  situation: GameSituation | null;
  target: string | null;
  invalidityCount: number;
  setTarget: (nickname: string | null) => void;
}

const VideoViewer = ({
  roomId,
  gameStatus,
  gamePublisher,
  gameSubscribers,
  situation,
  target,
  invalidityCount,
  setTarget,
}: VideoViewerProps) => {
  const { isOpen } = useSidebarStore();
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
      gameStatus === 'RUNNING'
        ? (gamePublisher.isAlive ? 1 : 0) +
          gameSubscribers.reduce(
            (total, gameSubscriber) => total + (gameSubscriber.isAlive ? 1 : 0),
            0,
          )
        : gameSubscribers.length + 1,
    [gamePublisher.isAlive, gameStatus, gameSubscribers],
  );

  return (
    <div
      className={[
        `${isOpen ? 'right-[21.5rem]' : 'right-6'}`,
        'absolute bottom-[5.5rem] left-6 top-6 max-h-screen overflow-auto transition-all duration-500 ease-out',
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
      <VideoFilter
        gameStatus={gameStatus}
        gamePublisher={gamePublisher}
        situation={situation}
      />
      {
        /* eslint-disable indent */
        gameStatus === 'RUNNING' &&
          (situation === 'PRIMARY_VOTE' || situation === 'FINAL_VOTE') && (
            <InvalidityButton
              roomId={roomId}
              gamePublisher={gamePublisher}
              target={target}
              invalidityCount={invalidityCount}
              setTarget={setTarget}
            />
          )
        /* eslint-enable indent */
      }
      <div
        className={[
          `${totalSurvivors <= 2 ? 'grid-rows-1' : 'grid-rows-2'}`,
          `${totalSurvivors <= 4 ? 'grid-cols-2' : totalSurvivors <= 6 ? 'grid-cols-3' : 'grid-cols-4'}`,
          'grid h-full min-w-[67.5rem] gap-6',
        ].join(' ')}
      >
        {(gameStatus !== 'RUNNING' || gamePublisher.isAlive) && (
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
          .filter(
            (gameSubscriber) =>
              gameStatus !== 'RUNNING' || gameSubscriber.isAlive,
          )
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
