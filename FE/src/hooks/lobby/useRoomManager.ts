import { RoomCreateFormSchema } from '@/libs/zod/roomCreateFormSchema';
import { useAuthStore } from '@/stores/authStore';
import { useParticipantListStore } from '@/stores/participantListStore';
import { useSocketStore } from '@/stores/socketStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const useRoomManager = () => {
  const { nickname } = useAuthStore();
  const { setParticipantList } = useParticipantListStore();
  const { socket } = useSocketStore();
  const router = useRouter();
  const methods = useForm<{ title: string; capacity: string }>({
    resolver: zodResolver(RoomCreateFormSchema),
    defaultValues: {
      title: '',
      capacity: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await methods.trigger();
    if (!methods.formState.isValid) {
      return;
    }

    const { title, capacity } = methods.getValues();
    socket?.emit('create-room', { title, capacity: Number(capacity) });
  };

  useEffect(() => {
    socket?.on('create-room', (data: { success: boolean; roomId: string }) => {
      if (data.success) {
        socket?.emit('enter-room', { roomId: data.roomId });
        setParticipantList([{ nickname, isOwner: true }]);
        const { title, capacity } = methods.getValues();
        router.push(
          `/game/${data.roomId}?roomName=${title}&capacity=${capacity}`,
        );
      }
    });

    return () => {
      socket?.off('create-room');
    };
  }, [methods, nickname, router, setParticipantList, socket]);

  return { methods, handleSubmit };
};
