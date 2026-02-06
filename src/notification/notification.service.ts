import { Injectable } from '@nestjs/common';
import { EventPublisher } from '../messaging/publisher/event.publisher';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationService {
    constructor(private readonly eventPublisher: EventPublisher) {}

    async sendNotification(sendNotificationDto: SendNotificationDto) {
        const { recipientId, message, title, type, metadata } =
            sendNotificationDto;

        const payload = {
            recipientId,
            message,
            title,
            type,
            metadata,
            sentAt: new Date().toISOString(),
        };

        await this.eventPublisher.publishNotification(payload);

        return {
            status: 'queued',
            data: payload,
        };
    }
}