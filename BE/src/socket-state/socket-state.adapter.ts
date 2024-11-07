import { INestApplication, INestApplicationContext, WebSocketAdapter } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { SocketStateService } from "./socket-state.service";
import { Server, ServerOptions } from "socket.io";

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
    constructor(
        private readonly app: INestApplication,
        private readonly socketStateService: SocketStateService,
    ) {
        super(app);
        app.useWebSocketAdapter();
    }

    // create(port: number, options?: ServerOptions & {
    //     namespace?: string;
    //     server?: any;
    // }): Server {
    //     const server = super.createIOServer(port, options);

    //     return server;
    // }

    // create(port: number, options: socketio.ServerOptions = {}): Server {
    //     const server = super.createIOServer(port, options);
    //     this.redisPropagatorService.injectSocketServer(server);
    
    //     server.use(async (socket: AuthenticatedSocket, next) => {
    //       const token = socket.handshake.query?.token || socket.handshake.headers?.authorization;
    
    //       if (!token) {
    //         socket.auth = null;
    
    //         // not authenticated connection is still valid
    //         // thus no error
    //         return next();
    //       }
    
    //       try {
    //         // fake auth
    //         socket.auth = {
    //           userId: '1234',
    //         };
    
    //         return next();
    //       } catch (e) {
    //         return next(e);
    //       }
    //     });
    
    //     return server;
    //   }

    // create(port: number, options?: ServerOptions & {
    //     namespace?: string;
    //     server?: any;
    // }): Server {
    //     const server = super.createIOServer(port, options);
    //     return server;
    // }

    create(port: number, options: any = {}): any {
        return new WebSocket.Server({ port, ...options });
    }
}