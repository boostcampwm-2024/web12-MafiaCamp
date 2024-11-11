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
  audioEnabled: boolean;
  videoEnabled: boolean;
}

const VideoViewer = ({
  isGameStarted,
  participants,
  publisher,
  subscribers,
  audioEnabled,
  videoEnabled,
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
        <div className='grid h-full min-w-[67.5rem] grid-cols-4 grid-rows-2 gap-6'>
          <VideoItem
            nickname={nickname}
            streamManager={publisher}
            audioEnabled={audioEnabled}
            videoEnabled={videoEnabled}
          />
          {subscribers.map((subscriber, index) => (
            <VideoItem
              key={index}
              nickname={subscriber.stream.connection.data.split('%/%')[0]}
              streamManager={subscriber}
              audioEnabled={subscriber.stream.audioActive}
              videoEnabled={subscriber.stream.videoActive}
            />
          ))}
        </div>
      ) : (
        <div className='grid h-full min-w-[67.5rem] grid-cols-4 grid-rows-2 gap-6'>
          {participants.map((participant, index) => (
            <VideoItem
              key={index}
              nickname={participant}
              streamManager={null}
              audioEnabled={false}
              videoEnabled={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoViewer;
