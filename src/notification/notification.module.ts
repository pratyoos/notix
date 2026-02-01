import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { UserModule } from '../user/user.module'
import { RedisModule } from '../redis/redis.module'

@Module({
    imports: [UserModule, RedisModule],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService],
})

export class NotificationModule {}