export interface Room {
  roomId: string;
  title: string;
  capacity: number;
  participants: number;
  status: 'READY' | 'RUNNING' | 'DONE';
  createdAt: number;
}
