import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';

import type { Question } from '../entities/question';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
	public ocurredAt: Date;
	public question: Question;
	public bestAnswerId: UniqueEntityId;

	constructor(question: Question, bestAnswerId: UniqueEntityId) {
		this.ocurredAt = new Date();
		this.question = question;
		this.bestAnswerId = bestAnswerId;
	}

	public getAggregateId(): UniqueEntityId {
		return this.question.id;
	}
}
