import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import databaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { RedisModule } from './redis/redis.module';
import { NotificationModule } from './notification/notification.module';

const db = databaseConfig().database;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: db.host,
      port: db.port,
      username: db.username,
      password: db.password,
      database: db.name,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    RedisModule,
    RateLimiterModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}