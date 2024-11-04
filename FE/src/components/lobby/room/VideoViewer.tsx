import VideoItem from './VideoItem';

const VideoViewer = () => {
  return (
    <div className='absolute bottom-6 left-6 right-[21.5rem] top-6 grid max-h-screen grid-cols-4 gap-6'>
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
