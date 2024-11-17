'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useSocketStore } from '@/stores/socketStore';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import { Role } from '@/constants/role';
import { Situation } from '@/constants/situation';

interface VideoViewerProps {
  roomId: string;
  isGameStarted: boolean;
  participantList: string[];
  playerRole: Role | null;
  otherMafiaList: string[] | null;
  situation: Situation | null;
  gamePublisher: GamePublisher | null;
  gameSubscribers: GameSubscriber[];
}

const VideoViewer = ({
  roomId,
  isGameStarted,
  participantList,
  playerRole,
  otherMafiaList,
  situation,
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
      {situation === 'VOTE' && (
        <div className='pointer-events-none absolute bottom-0 left-0 z-10 h-full w-full bg-slate-800/75' />
      )}
      {/* TODO: key 값으로 index 사용하지 않기 */}
      {isGameStarted ? (
        <div
          className={`${gameSubscribers.length <= 1 ? 'grid-rows-1' : 'grid-rows-2'} ${gameSubscribers.length <= 3 ? 'grid-cols-2' : gameSubscribers.length <= 5 ? 'grid-cols-3' : 'grid-cols-4'} grid h-full min-w-[67.5rem] gap-6`}
        >
          <VideoItem
            roomId={roomId}
            playerNickname={nickname}
            role={playerRole}
            gameParticipant={gamePublisher}
            situation={situation}
            votes={0}
          />
          {gameSubscribers.map((gameSubscriber, index) => (
            <VideoItem
              key={index}
              roomId={roomId}
              playerNickname={gameSubscriber.nickname}
              role={
                otherMafiaList?.includes(gameSubscriber.nickname)
                  ? 'MAFIA'
                  : null
              }
              gameParticipant={gameSubscriber}
              situation={situation}
              votes={0}
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
              roomId={roomId}
              playerNickname={participant}
              role={null}
              gameParticipant={null}
              situation={situation}
              votes={0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoViewer;
