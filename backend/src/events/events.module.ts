import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Event } from './entities/event.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Event,User])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
