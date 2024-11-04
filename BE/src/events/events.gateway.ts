import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class EventsGateway {
	// @WebSocketServer()
	// server: Server;

	@SubscribeMessage('create-room')
	createRoom(
		@MessageBody() data: unknown,
		@ConnectedSocket() client: Socket
	): WsResponse<unknown> {
		console.log(client.id);
		// console.log(data);
		// client.emit('create-room', data);
		return {
			event: 'create-room',
			data
		};
	}
}