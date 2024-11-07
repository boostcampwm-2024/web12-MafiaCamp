import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room, RoomStatus } from './room.model';

@Injectable()
export class RoomsService {
  private rooms: Room[] = [];

  getRooms() {
    return [...this.rooms];
  }

  createRoom(createRoomDto: CreateRoomDto) {
    const room: Room = {
      ...createRoomDto,
      participants: 1,
      status: RoomStatus.READY,
      createdAt: Date.now(),
    };

    this.rooms = [...this.rooms, room];
  }

  enterRoom(roomId) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new NotFoundException();
    }
    if (room.capacity === room.participants) {
      throw new BadRequestException();
    }
    room.participants += 1;
  }
}
