export interface Room {
  roomId: string;
  owner: string;
  title: string;
  capacity: number;
  participants: number;
  status: 'READY' | 'RUNNING';
  createdAt: number;
}
