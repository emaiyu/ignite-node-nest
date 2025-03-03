/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { DomainEvents } from '@/core/events/domain-events';
import type { EventHandler } from '@/core/events/event-handler';
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';

import type { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionRepository: QuestionRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		);
	}

	private async sendNewAnswerNotification({
		answer,
	}: AnswerCreatedEvent): Promise<void> {
		// console.log('sendNewAnswerNotification', answer);
		const question = await this.questionRepository.findById(
			answer.questionId.toString(),
		);

		if (question) {
			await this.sendNotification.execute({
				recipientId: question.authorId.toString(),
				title: 'Novo resposta '
					.concat(question.title.substring(0, 40))
					.concat('...'),
				content: answer.excerpt,
			});
		}
	}
}
