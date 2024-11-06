import { Server, Socket } from 'socket.io';

export interface WebSocketClient {
  nickname?: string;
  roomId?: string;
}

export class WebSocketServer {
  private readonly server: Server;
  private connectedClients: Map<Socket, WebSocketClient> = new Map();

  constructor(server) {
    this.server = server;
  }

  connect(socket: Socket) {
    this.connectedClients.set(socket, {});
  }

  disconnect(socket: Socket) {
    this.connectedClients.delete(socket);
  }

  setClientInfo(socket: Socket, info: WebSocketClient) {
    const client = this.connectedClients.get(socket);
    client.nickname = info.nickname || client.nickname;
  }

  joinClient(socket: Socket, roomId: string) {
    const client = this.connectedClients.get(socket);
    socket.join(roomId);
    client.roomId = roomId;
    this.sendNoticeToRoom(roomId, `${client.nickname}님이 입장하셨습니다.`);
  }

  sendNoticeToRoom(roomId: string, message: string) {
    this.server.to(roomId).emit('chat', {
      from: 'Notice',
      to: 'Room',
      message,
    });
  }

  sendChatToRoom(socket: Socket, message: string) {
    const { roomId, nickname } = this.connectedClients.get(socket);
    this.server.to(roomId).emit('chat', {
      from: nickname,
      to: 'Room',
      message,
    });
  }
}
