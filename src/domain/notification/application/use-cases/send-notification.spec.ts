import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryNotificationRepository } from '@/repositories/in-memory-notification-repository';

import { SendNotificationUseCase } from './send-notification';

let notificationRepository: InMemoryNotificationRepository;

let sut: SendNotificationUseCase;

describe('Notification question', function () {
	beforeEach(function () {
		notificationRepository = new InMemoryNotificationRepository();
		sut = new SendNotificationUseCase(notificationRepository);
	});

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			recipientId: '1',
			content: 'Nova notificação',
			title: 'Conteúdo da notificação',
		});

		expect(result.isRight()).toBe(true);

		expect(notificationRepository.items[0]).toEqual(result.value?.notification);
	});
});
