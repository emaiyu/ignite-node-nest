import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeNotification } from '@/factories/make-notification';
import { InMemoryNotificationRepository } from '@/repositories/in-memory-notification-repository';

import { ReadNotificationUseCase } from './read-notification';

let notificationsRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe('Send Notification', () => {
	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationRepository();
		sut = new ReadNotificationUseCase(notificationsRepository);
	});

	it('should be able to read a notification', async () => {
		const notification = makeNotification();

		await notificationsRepository.create(notification);

		const result = await sut.execute({
			recipientId: notification.recipientId.toString(),
			notificationId: notification.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date));
	});

	it('should not be able to read a notification from another user', async () => {
		const notification = makeNotification({
			recipientId: new UniqueEntityId('recipient-1'),
		});

		await notificationsRepository.create(notification);

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: 'recipient-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
