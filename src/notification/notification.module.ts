import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
    imports: [UserModule, RedisModule, MessagingModule],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService],
})

export class NotificationModule {}