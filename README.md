# Notix: Notification System Backend

An event-driven notification backend that queues delivery for email, SMS, and push notifications using NestJS, Redis, and RabbitMQ.

Built with NestJS and TypeORM, using Redis for caching/rate-limiting and RabbitMQ for message delivery.

---

## Features

- JWT authentication with role-based access
- Rate limiting backed by Redis
- Notification queueing via RabbitMQ
- Modular architecture for easy scaling
- PostgreSQL persistence with TypeORM

---

## Notification Types

| Type (EN) | Description |
|-----------|-------------|
| email     | Email notifications |
| sms       | SMS notifications |
| push      | Push notifications |

---

## Queue Details

- Broker: RabbitMQ
- Queue: `notifications`
- Delivery: Persistent messages

---

## Tech Stack

- Node.js 20+
- NestJS 11
- TypeORM
- PostgreSQL
- Redis
- RabbitMQ

---

## Run Locally

### 1. Clone the repository
```
git clone https://github.com/pratyoos/notix.git
cd notix
```

### 2. Install dependencies and run the app
```
pnpm install
pnpm dev
```


## API Endpoints

Base URL: `http://localhost:3000`

### Auth

#### POST /auth/register

Create a new user.

Request body:
```json
{
	"email": "user@example.com",
	"password": "strong_password",
	"role": "user"
}
```

Response (200):
```json
{
	"id": 1,
	"email": "user@example.com",
	"role": "user"
}
```

Possible errors:
- 400 if required fields are missing

#### POST /auth/login

Authenticate a user and return a JWT.

Request body:
```json
{
	"email": "user@example.com",
	"password": "strong_password",
	"role": "user"
}
```

Response (200):
```json
{
	"access_token": "<jwt>"
}
```

Possible errors:
- 401 for invalid credentials

### App

#### GET /

Health/hello endpoint. Rate-limited.

Response (200):
```json
{
	"message": "Hello World!"
}
```

#### GET /protected-hello

Protected endpoint. Requires `Authorization: Bearer <jwt>` and is rate-limited.

Response (200):
```json
{
	"message": "Hello authenticated user",
	"user": {
		"userId": 1,
		"email": "user@example.com",
		"role": "user"
	}
}
```

Possible errors:
- 401 if token is missing/invalid
- 429 if rate limit exceeded

#### GET /admin-only

Admin-only endpoint. Requires `Authorization: Bearer <jwt>` with role `admin` and is rate-limited.

Response (200):
```json
{
	"message": "Hello admin user",
	"user": {
		"userId": 1,
		"email": "admin@example.com",
		"role": "admin"
	}
}
```

Possible errors:
- 401 if token is missing/invalid
- 403 if role is not `admin`
- 429 if rate limit exceeded

### Notifications

#### POST /notifications/send

Queue a notification for delivery.

Request body:
```json
{
	"recipientId": "user-123",
	"message": "Your order is ready",
	"title": "Order Update",
	"type": "push",
	"metadata": {
		"orderId": "ORD-001"
	}
}
```

Response (200):
```json
{
	"status": "queued",
	"data": {
		"recipientId": "user-123",
		"message": "Your order is ready",
		"title": "Order Update",
		"type": "push",
		"metadata": {
			"orderId": "ORD-001"
		},
		"sentAt": "2026-02-06T12:00:00.000Z"
	}
}
```

Notes:
- `title`, `type`, and `metadata` are optional
- `type` must be one of: `email`, `sms`, `push`

## Project Structure
```
.
├── src/                          # Application source code
│   ├── auth/                     # Auth, guards, strategies
│   ├── config/                   # Config providers
│   ├── messaging/                # RabbitMQ connection, publisher, consumer
│   ├── notification/             # Notification module
│   ├── rate-limiter/             # Redis-backed rate limiting
│   ├── redis/                    # Redis connection and cache service
│   └── user/                     # User entity and service
├── test/                         # e2e tests
├── .env.example                  # Environment variables
├── README.md                     # Project documentation
├── package.json                  # Node dependencies
└── tsconfig.json                 # TypeScript config
```
---

## Deployment

This service can be deployed with any Node.js hosting provider.

Steps:
1. Push the repository to GitHub
2. Provision PostgreSQL, Redis, and RabbitMQ
3. Set environment variables from .env.example
4. Build and start the service

---

## Future Improvements

- Add delivery workers for email/SMS/push
- Add notification templates
- Add delivery retry policies and DLQ
- Add observability (metrics and tracing)

---

## Author
Made with ❤️ by [Pratyoos](https://github.com/pratyoos)