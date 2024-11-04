'use client';

import { useSidebarStore } from '@/stores/sidebarStore';
import VideoItem from './VideoItem';

const VideoViewer = () => {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={`${isOpen ? 'right-[21.5rem]' : 'right-24'} absolute bottom-6 left-6 top-6 grid max-h-screen grid-cols-4 gap-6 transition-all duration-500`}
    >
      <VideoItem />
      <VideoItem />
      <VideoItem />
      <VideoItem />
      <VideoItem />
      <VideoItem />
      <VideoItem />
      <VideoItem />
    </div>
  );
};

export default VideoViewer;
