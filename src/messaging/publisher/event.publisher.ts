import { Injectable } from '@nestjs/common';
import type { Options } from 'amqplib';
import rabbitmqConfig from '../../config/rabbitmq.config';
import { RabbitmqConnection } from '../rabbitmq.connection';

export interface NotificationEvent {
	recipientId: string;
	message: string;
	title?: string;
	type?: 'email' | 'sms' | 'push';
	metadata?: Record<string, any>;
	sentAt: string;
}

@Injectable()
export class EventPublisher {
	constructor(private readonly rabbitmqConnection: RabbitmqConnection) {}

	async publish(
		queue: string,
		payload: unknown,
		options?: Options.Publish,
	): Promise<void> {
		const channel = await this.rabbitmqConnection.getChannel();
		await this.rabbitmqConnection.assertQueue(queue);
		const buffer = Buffer.from(JSON.stringify(payload));
		channel.sendToQueue(queue, buffer, { persistent: true, ...options });
	}

	async publishNotification(payload: NotificationEvent): Promise<void> {
		await this.publish(rabbitmqConfig.queue, payload);
	}
}
