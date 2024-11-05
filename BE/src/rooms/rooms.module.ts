import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsService],
  exports: [RoomsService]
})
export class RoomsModule {}
