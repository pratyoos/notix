export default {
    uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
    queue: process.env.RABBITMQ_QUEUE || 'notifications',
    options: {
        durable: true,
    },
};

