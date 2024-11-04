import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [EventsModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
