/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { DomainEvents } from '@/core/events/domain-events';
import type { EventHandler } from '@/core/events/event-handler';
import type { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen';

import type { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnQuestionBestAnswerChose implements EventHandler {
	constructor(
		private answerRepository: AnswerRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		);
	}

	private async sendQuestionBestAnswerNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChosenEvent): Promise<void> {
		const answer = await this.answerRepository.findById(
			bestAnswerId.toString(),
		);

		if (answer) {
			await this.sendNotification.execute({
				recipientId: answer.authorId.toString(),
				title: 'Sua resposta foi escolhida!',
				content: 'A reposta que voce enviou em '
					.concat(question.title.substring(0, 20).concat('...'))
					.concat(' foi escolhida pelo autor!'),
			});
		}
	}
}
