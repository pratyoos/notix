export class SendNotificationDto {
    recipientId: string
    message: string
    title?: string
    type?: 'email' | 'sms' | 'push'
    metadata?: Record<string, any>
}