import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsService]
})
export class RoomsModule {}
