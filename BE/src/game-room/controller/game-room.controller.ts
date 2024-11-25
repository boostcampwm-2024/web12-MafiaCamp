import { Controller, Get, UseGuards } from '@nestjs/common';
import { GameRoomService } from '../game-room.service';
import { CommonJwtGuard } from '../../auth/guard/common.jwt.guard';

@Controller('rooms')
export class GameRoomController {

  constructor(private readonly gameRoomService: GameRoomService) {
  }

  @Get('vacant')
  @UseGuards(CommonJwtGuard)
  getVacantRoom() {
    return {
      roomId: this.gameRoomService.findVacantRoomId(),
    };
  }

}