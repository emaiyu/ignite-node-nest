import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

import { AnswerCreatedEvent } from '../events/answer-created-event';

import { AnswerAttachmentList } from './answer-attachment-list';

interface Props {
	authorId: UniqueEntityId;
	questionId: UniqueEntityId;
	content: string;
	attachments: AnswerAttachmentList;
	createdAt: Date;
	updatedAt?: Date;
}

export class Answer extends AggregateRoot<Props> {
	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get questionId(): UniqueEntityId {
		return this.props.questionId;
	}

	get content(): string {
		return this.props.content;
	}

	get attachments(): AnswerAttachmentList {
		return this.props.attachments;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | undefined {
		return this.props.updatedAt;
	}

	get excerpt(): string {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}

	private touch(): void {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set attachments(attachments: AnswerAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	static create(
		props: Optional<Props, 'createdAt' | 'attachments'>,
		id?: UniqueEntityId,
	): Answer {
		const answer = new Answer(
			{
				...props,
				attachments: props.attachments ?? new AnswerAttachmentList(),

				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		const isNewAnswer = !id;

		if (isNewAnswer) {
			answer.addDomainEvent(new AnswerCreatedEvent(answer));
		}

		return answer;
	}
}

export { Props as AnswerProps };
