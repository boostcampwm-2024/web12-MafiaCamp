import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketStateService {
    private socketState: Map<string, Socket[]> = new Map();

    public remove(userId: string, socket: Socket): boolean {
        const existingSockets = this.socketState.get(userId);

        if (!existingSockets) {
            return true;
        }

        const sockets = existingSockets.filter(s => s.id !== socket.id);

        if (!sockets.length) {
            this.socketState.delete(userId);
        } else {
            this.socketState.set(userId, sockets);
        }

        return true;
    }
}
