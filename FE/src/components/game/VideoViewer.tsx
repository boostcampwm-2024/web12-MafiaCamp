'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useSocketStore } from '@/stores/socketStore';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import { Role } from '@/constants/role';
import { Participant } from '@/types/participant';

interface VideoViewerProps {
  isGameStarted: boolean;
  participantList: Participant[];
  playerRole: Role | null;
  otherMafiaList: string[] | null;
  gamePublisher: GamePublisher | null;
  gameSubscribers: GameSubscriber[];
}

const VideoViewer = ({
  isGameStarted,
  participantList,
  playerRole,
  otherMafiaList,
  gamePublisher,
  gameSubscribers,
}: VideoViewerProps) => {
  const { isOpen } = useSidebarStore();
  const { nickname } = useSocketStore();
  const {
    listRef,
    onDragStart,
    onDragMove,
    onDragEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useDragScroll();

  return (
    <div
      className={`${isOpen ? 'right-[21.5rem]' : 'right-6'} absolute bottom-[6.5rem] left-6 top-6 max-h-screen overflow-auto transition-all duration-500 ease-out`}
      ref={listRef}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* TODO: key 값으로 index 사용하지 않기 */}
      {isGameStarted ? (
        <div
          className={`${gameSubscribers.length <= 1 ? 'grid-rows-1' : 'grid-rows-2'} ${gameSubscribers.length <= 3 ? 'grid-cols-2' : gameSubscribers.length <= 5 ? 'grid-cols-3' : 'grid-cols-4'} grid h-full min-w-[67.5rem] gap-6`}
        >
          <VideoItem
            nickname={nickname}
            role={playerRole}
            gameParticipant={gamePublisher}
          />
          {gameSubscribers.map((gameSubscriber, index) => (
            <VideoItem
              key={index}
              nickname={
                gameSubscriber.participant.stream.connection.data.split(
                  '%/%',
                )[0]
              }
              role={
                otherMafiaList?.includes(
                  gameSubscriber.participant.stream.connection.data.split(
                    '%/%',
                  )[0],
                )
                  ? 'MAFIA'
                  : null
              }
              gameParticipant={gameSubscriber}
            />
          ))}
        </div>
      ) : (
        <div
          className={`${participantList.length <= 2 ? 'grid-rows-1' : 'grid-rows-2'} ${participantList.length <= 4 ? 'grid-cols-2' : participantList.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'} grid h-full min-w-[67.5rem] gap-6`}
        >
          {participantList.map((participant, index) => (
            <VideoItem
              key={index}
              nickname={participant.nickname}
              role={null}
              gameParticipant={null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoViewer;
