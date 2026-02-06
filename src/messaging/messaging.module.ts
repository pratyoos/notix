import { Module } from '@nestjs/common';
import { RabbitmqConnection } from './rabbitmq.connection';
import { EventPublisher } from './publisher/event.publisher';
import { EventConsumer } from './consumer/event.consumer';

@Module({
	providers: [RabbitmqConnection, EventPublisher, EventConsumer],
	exports: [RabbitmqConnection, EventPublisher, EventConsumer],
})
export class MessagingModule {}
