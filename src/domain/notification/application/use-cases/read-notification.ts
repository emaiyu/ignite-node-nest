import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import type { Notification } from '../../enterprise/entities/notification';
import type { NotificationRepository } from '../repositories/notification-repository';

interface ReadNotificationUseCaseRequest {
	recipientId: string;
	notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		notification: Notification;
	}
>;

export class ReadNotificationUseCase {
	constructor(private notificationRepository: NotificationRepository) {}

	async execute({
		recipientId,
		notificationId,
	}: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification =
			await this.notificationRepository.findById(notificationId);

		if (!notification) return left(new ResourceNotFoundError());

		if (recipientId !== notification.recipientId.toString())
			return left(new NotAllowedError());

		notification.read();

		await this.notificationRepository.save(notification);
		return right({ notification });
	}
}
