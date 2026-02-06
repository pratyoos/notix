import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface RateLimitResult {
	allowed: boolean;
	current: number;
	limit: number;
	windowSeconds: number;
}

@Injectable()
export class RateLimiterService {
	private readonly defaultLimit = Number(process.env.RATE_LIMIT_MAX) || 5;
	private readonly defaultWindow = Number(process.env.RATE_LIMIT_WINDOW) || 60;

	constructor(private readonly redisService: RedisService) {}

	async checkLimit(
		identifier: string,
		limit = this.defaultLimit,
		windowSeconds = this.defaultWindow,
	): Promise<RateLimitResult> {
		const client = this.redisService.getClient();
		const key = `rate_limit:${identifier}`;
		const current = await client.incr(key);

		if (current === 1) {
			await client.expire(key, windowSeconds);
		}

		return {
			allowed: current <= limit,
			current,
			limit,
			windowSeconds,
		};
	}
}
