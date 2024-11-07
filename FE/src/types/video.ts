export interface StreamManager {
  stream: {
    getMediaStream: () => MediaStream;
  };
}

export interface Publisher extends StreamManager {
  publishAudio: (value: boolean) => void;
  publishVideo: (value: boolean) => void;
}

export type Subscriber = StreamManager;
