'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import { useDragScroll } from '@/hooks/useDragScroll';
import { Publisher, Subscriber } from 'openvidu-browser';
import { useSocketStore } from '@/stores/socketStore';

interface VideoViewerProps {
  isGameStarted: boolean;
  participants: string[];
  publisher: Publisher | null;
  subscribers: Subscriber[];
}

const VideoViewer = ({
  isGameStarted,
  participants,
  publisher,
  subscribers,
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
          className={`${subscribers.length <= 1 ? 'grid-rows-1' : 'grid-rows-2'} ${subscribers.length <= 3 ? 'grid-cols-2' : subscribers.length <= 5 ? 'grid-cols-3' : 'grid-cols-4'} grid h-full min-w-[67.5rem] gap-6`}
        >
          <VideoItem nickname={nickname} streamManager={publisher} />
          {subscribers.map((subscriber, index) => (
            <VideoItem
              key={index}
              nickname={subscriber.stream.connection.data.split('%/%')[0]}
              streamManager={subscriber}
            />
          ))}
        </div>
      ) : (
        <div
          className={`${participants.length <= 2 ? 'grid-rows-1' : 'grid-rows-2'} ${participants.length <= 4 ? 'grid-cols-2' : participants.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'} grid h-full min-w-[67.5rem] gap-6`}
        >
          {participants.map((participant, index) => (
            <VideoItem
              key={index}
              nickname={participant}
              streamManager={null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoViewer;
