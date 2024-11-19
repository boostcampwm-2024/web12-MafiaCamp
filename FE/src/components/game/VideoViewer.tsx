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
  target: string | null;
  invalidityCount: number;
  setTarget: (nickname: string | null) => void;
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
      {situation === 'VOTE' && (
        <button
          className={`${target === 'INVALIDITY' ? 'border-2 bg-slate-600 text-white' : 'bg-white font-bold text-slate-800'} absolute right-0 top-0 z-20 h-[3.75rem] w-[11.25rem] rounded-2xl border border-slate-400 font-bold hover:bg-slate-600 hover:text-white`}
          onClick={() => {
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
          }}
        >
          {`기권 ${invalidityCount}`}
        </button>
      )}
      {/* TODO: key 값으로 index 사용하지 않기 + 코드 리팩토링 */}
      {isGameStarted ? (
        <div
          className={`${gameSubscribers.length <= 1 ? 'grid-rows-1' : 'grid-rows-2'} ${gameSubscribers.length <= 3 ? 'grid-cols-2' : gameSubscribers.length <= 5 ? 'grid-cols-3' : 'grid-cols-4'} grid h-full min-w-[67.5rem] gap-6`}
        >
          {gamePublisher && (
            <VideoItem
              roomId={roomId}
              playerNickname={nickname}
              role={playerRole}
              gameParticipant={gamePublisher}
              situation={situation}
              target={target}
              setTarget={setTarget}
            />
          )}
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
              target={target}
              setTarget={setTarget}
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
              target={target}
              setTarget={setTarget}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoViewer;
