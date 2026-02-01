import { Injectable } from '@nestjs/common'
import { SendNotificationDto } from './dto/send-notification.dto'

@Injectable()
export class NotificationService {
    async sendNotification(sendNotificationDto: SendNotificationDto) {
        const { recipientId, message, title, type, metadata } = sendNotificationDto
        
        return {
            status: 'success',
            data: {
                recipientId,
                message,
                title,
                type,
                metadata,
            },
        }
    }
}