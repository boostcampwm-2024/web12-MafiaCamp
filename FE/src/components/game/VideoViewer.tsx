'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import { useDragScroll } from '@/hooks/useDragScroll';
import { Publisher } from 'openvidu-browser';

interface VideoViewerProps {
  publisher: Publisher | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

const VideoViewer = ({
  publisher,
  audioEnabled,
  videoEnabled,
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
      <div className='grid h-full min-w-[67.5rem] grid-cols-4 grid-rows-2 gap-6'>
        <VideoItem
          streamManager={publisher}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
        />
        {/* <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem /> */}
      </div>
    </div>
  );
};

export default VideoViewer;
