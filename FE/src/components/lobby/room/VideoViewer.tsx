import VideoItem from './VideoItem';

const VideoViewer = () => {
  return (
    <div className='absolute bottom-6 left-6 top-6 grid grid-cols-3 gap-6'>
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
