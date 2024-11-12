'use client';

import { useOpenVidu } from '@/hooks/useOpenVidu';
import Bottombar from './Bottombar';
import ChattingList from './ChattingList';
import VideoViewer from './VideoViewer';

const GameViewer = () => {
  const {
    publisher,
    subscribers,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  } = useOpenVidu();

  return (
    <div className='absolute left-0 top-0 h-screen w-screen overflow-x-hidden'>
      <VideoViewer
        publisher={publisher}
        subscribers={subscribers}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
      />
      <Bottombar toggleAudio={toggleAudio} toggleVideo={toggleVideo} />
      <ChattingList />
    </div>
  );
};

export default GameViewer;
