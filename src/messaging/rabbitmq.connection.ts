import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { connect, type Channel, type Connection } from 'amqplib';
import rabbitmqConfig from '../config/rabbitmq.config';

@Injectable()
export class RabbitmqConnection implements OnModuleDestroy {
	private connection: Connection | null = null;
	private channel: Channel | null = null;
	private readonly logger = new Logger(RabbitmqConnection.name);

	private async connect(): Promise<Connection> {
		if (this.connection) {
			return this.connection;
		}

		const connection = await connect(rabbitmqConfig.uri);
		connection.on('error', (error) => {
			this.logger.error('RabbitMQ connection error', error);
		});
		connection.on('close', () => {
			this.logger.warn('RabbitMQ connection closed');
			this.connection = null;
			this.channel = null;
		});

		this.connection = connection;
		return connection;
	}

	private async createChannel(): Promise<Channel> {
		const connection = await this.connect();
		return connection.createChannel();
	}

	async getChannel(): Promise<Channel> {
		if (!this.channel) {
			this.channel = await this.createChannel();
		}

		return this.channel;
	}

	async assertQueue(queue = rabbitmqConfig.queue): Promise<string> {
		const channel = await this.getChannel();
		await channel.assertQueue(queue, rabbitmqConfig.options);
		return queue;
	}

	async onModuleDestroy(): Promise<void> {
		try {
			if (this.channel) {
				await this.channel.close();
			}
			if (this.connection) {
				await this.connection.close();
			}
		} catch (error) {
			this.logger.warn('RabbitMQ close failed', error as Error);
		} finally {
			this.channel = null;
			this.connection = null;
		}
	}
}
