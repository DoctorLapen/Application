import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

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

      autoLoadEntities: configService.get<string>('DB_AUTOLOAD_ENTITIES') === 'true',
      synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      logging: true, 
      
    }),
  }),

  AuthModule],
  
})
export class AppModule { }
