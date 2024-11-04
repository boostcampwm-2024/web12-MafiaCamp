export interface Room {
	id: string;
	title: string;
	capacity: number;
	participants: string[]; // 참가자들의 Socket id
	status: RoomStatus;
	createdAt;
}

export enum RoomStatus {
	READY = 'READY',
	RUNNING = 'RUNNING',
	DONE = 'DONE'
}