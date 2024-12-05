'use client';

import { GameSituation } from '@/constants/situation';
import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import { useEffect, useRef } from 'react';

export const useVideoItem = (
  roomId: string,
  isPublisherAlive: boolean,
  gameParticipant: GamePublisher | GameSubscriber,
  situation: GameSituation | null,
  target: string | null,
  setTarget: (nickname: string | null) => void,
) => {
  const { nickname } = useAuthStore();
  const { socket } = useSocketStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (!situation || !isPublisherAlive || !gameParticipant.isCandidate) {
      return;
    }

    switch (situation) {
      case 'PRIMARY_VOTE':
      case 'FINAL_VOTE':
        if (target !== null) {
          socket?.emit('cancel-vote-candidate', {
            roomId,
            from: nickname,
            to: target,
          });
        }

        if (target === gameParticipant.nickname) {
          setTarget(null);
          return;
        }

        setTarget(gameParticipant.nickname);
        socket?.emit('vote-candidate', {
          roomId,
          from: nickname,
          to: gameParticipant.nickname,
        });
        break;
      case 'MAFIA':
        socket?.emit('select-mafia-target', {
          roomId,
          from: nickname,
          target: gameParticipant.nickname,
        });
        break;
      case 'DOCTOR':
        setTarget(gameParticipant.nickname);
        socket?.emit('select-doctor-target', {
          roomId,
          from: nickname,
          target: gameParticipant.nickname,
        });
        break;
      case 'POLICE':
        socket?.emit('police-investigate', {
          roomId,
          police: nickname,
          criminal: gameParticipant.nickname,
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (videoRef.current && gameParticipant.participant) {
      gameParticipant.participant.addVideoElement(videoRef.current);
    }
  }, [gameParticipant.participant]);

  return { videoRef, handleClick };
};
