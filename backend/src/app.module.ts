import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { User } from './auth/entities/user.entity';
import { Event } from './events/entities/event.entity';
import { Tag } from './events/entities/tag.entity';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),

  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: configService.get<string>('DB_TYPE') as any || 'postgres',
      url: configService.get<string>('DATABASE_URL'),

      ssl: configService.get<string>('DB_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : false,

      entities: [User,Event,Tag],
      synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      logging: true, 
      
    }),
  }),

  AuthModule,

  EventsModule],
  
})
export class AppModule { }
