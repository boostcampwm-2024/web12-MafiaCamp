'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';
import useDragScroll from '@/hooks/useDragScroll';

const VideoViewer = () => {
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
      <div className='grid h-full min-w-[67.5rem] grid-cols-4 gap-6'>
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
        <VideoItem />
      </div>
    </div>
  );
};

export default VideoViewer;
