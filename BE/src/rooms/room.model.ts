import { RoomsModule } from './rooms.module';

export interface Room {
  roomId: string; // 방장의 Socket id
  title: string; // 방 제목
  capacity: number; // 방 정원
  participants: number; // 방 참가자 수
  status: RoomStatus;
  createdAt: number; // timestamp
}

export const RoomStatus = {
  READY: 'READY',
  RUNNING: 'RUNNING',
  DONE: 'DONE',
} as const;

export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];
