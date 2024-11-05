import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { CreateRoomDto } from "src/rooms/dto/create-room.dto";
import { Room } from "src/rooms/room.model";
import { RoomsService } from "src/rooms/rooms.service";
import { Logger } from "@nestjs/common";
import { WebSocketServer} from "./wss";

@WebSocketGateway({
	namespace: 'ws',
	cors: {
		origin: '*'
	}
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(EventsGateway.name);
	private wss: WebSocketServer;

	constructor(private readonly roomsService: RoomsService) {}

	afterInit(server: any) {
		this.wss = new WebSocketServer(server);
	}

	handleConnection(socket: Socket) {
		this.logger.log(`client connected: ${socket.id}`);
		this.wss.connect(socket);
	}

	handleDisconnect(socket: Socket) {
		this.logger.log(`client disconnected: ${socket.id}`);
		this.wss.disconnect(socket);
	}

	@SubscribeMessage('set-nickname')
	setNickname(
		@MessageBody() data: { nickname: string },
		@ConnectedSocket() socket: Socket
	) {
		const { nickname } = data;
		this.wss.setClientInfo(socket, { nickname });
	}

	@SubscribeMessage('room-list')
	getRooms(): WsResponse<Room[]> {
		return {
			event: 'room-list',
			data: this.roomsService.getRooms()
		};
	}

	@SubscribeMessage('create-room')
	createRoom(
		@MessageBody() createRoomDto: CreateRoomDto,
		@ConnectedSocket() socket: Socket
	) {
		const roomId = socket.id;
		this.roomsService.createRoom({
			...createRoomDto,
			roomId
		});
		this.wss.joinClient(socket, roomId);
	}

	@SubscribeMessage('enter-room')
	enterRoom(
		@MessageBody() data: { roomId: string },
		@ConnectedSocket() socket: Socket
	) {
		const { roomId } = data;
		this.roomsService.enterRoom(roomId);
		// RoomsService.enterRoom에서 정원 체크 후 통과하면,
		this.wss.joinClient(socket, roomId);
	}

	@SubscribeMessage('send-chat')
	messageRoom(
		@MessageBody() data: { message: string },
		@ConnectedSocket() socket: Socket
	) {
		const { message } = data;
		this.wss.sendChatToRoom(socket, message);
	}
}