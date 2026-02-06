import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

export interface HandledError {
	statusCode: number;
	message: string;
}

@Injectable()
export class ErrorHandlerService {
	private readonly logger = new Logger(ErrorHandlerService.name);

	handle(error: unknown, context?: string): HandledError {
		if (error instanceof HttpException) {
			const statusCode = error.getStatus();
			const response = error.getResponse();
			const message =
				typeof response === 'string'
					? response
					: Array.isArray((response as { message?: string[] }).message)
						? (response as { message: string[] }).message.join(', ')
						: (response as { message?: string }).message ?? error.message;

			this.logger.warn(`[${context ?? 'Error'}] ${message}`);
			return { statusCode, message };
		}

		const message = error instanceof Error ? error.message : 'Internal server error';
		this.logger.error(context ?? 'Unhandled error', error as Error);
		return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message };
	}
}
