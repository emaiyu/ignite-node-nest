import { right, type Either } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Notification } from '../../enterprise/entities/notification';
import type { NotificationRepository } from '../repositories/notification-repository';

export interface SendNotificationPayload {
	recipientId: string;
	title: string;
	content: string;
}

export type SendNotificationResult = Either<
	null,
	{
		notification: Notification;
	}
>;

export class SendNotificationUseCase {
	constructor(private notificationRepository: NotificationRepository) {}
	async execute(
		payload: SendNotificationPayload,
	): Promise<SendNotificationResult> {
		const notification = Notification.create({
			recipientId: new UniqueEntityId(payload.recipientId),
			title: payload.title,
			content: payload.content,
		});

		await this.notificationRepository.create(notification);

		return right({
			notification,
		});
	}
}
