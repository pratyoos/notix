import { Injectable, Logger } from '@nestjs/common';
import rabbitmqConfig from '../../config/rabbitmq.config';
import { RabbitmqConnection } from '../rabbitmq.connection';

type ConsumerHandler<T> = (payload: T) => Promise<void> | void;

@Injectable()
export class EventConsumer {
	private readonly logger = new Logger(EventConsumer.name);

	constructor(private readonly rabbitmqConnection: RabbitmqConnection) {}

	async consume<T>(queue: string, handler: ConsumerHandler<T>): Promise<void> {
		const channel = await this.rabbitmqConnection.getChannel();
		await this.rabbitmqConnection.assertQueue(queue);

		await channel.consume(queue, async (message) => {
			if (!message) {
				return;
			}

			try {
				const payload = JSON.parse(message.content.toString()) as T;
				await handler(payload);
				channel.ack(message);
			} catch (error) {
				this.logger.error('RabbitMQ message handling failed', error as Error);
				channel.nack(message, false, false);
			}
		});
	}

	async consumeNotifications<T>(handler: ConsumerHandler<T>): Promise<void> {
		await this.consume<T>(rabbitmqConfig.queue, handler);
	}
}
