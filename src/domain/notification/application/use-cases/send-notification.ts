import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { Notification } from '../../enterprise/entities/notification';
import { NotificationRepository } from '../repositories/notification-repository';

export interface SendNotificationUseCaseRequest {
	recipientId: string;
	title: string;
	content: string;
}

export type SendNotificationUseCaseResponse = Either<
	null,
	{
		notification: Notification;
	}
>;

@Injectable()
export class SendNotificationUseCase {
	constructor(private notificationsRepository: NotificationRepository) {}

	async execute({
		recipientId,
		title,
		content,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			recipientId: new UniqueEntityId(recipientId),
			title,
			content,
		});

		await this.notificationsRepository.create(notification);

		return right({
			notification,
		});
	}
}
