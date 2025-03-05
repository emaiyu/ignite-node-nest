import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import type { Attachment } from '../attachment';
import type { Slug } from './slug';

export interface QuestionDetailsProps {
	questionId: UniqueEntityId;
	authorId: UniqueEntityId;
	author: string;
	title: string;
	content: string;
	slug: Slug;
	attachments: Attachment[];
	bestAnswerId?: UniqueEntityId | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
	get questionId(): UniqueEntityId {
		return this.props.questionId;
	}

	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get author(): string {
		return this.props.author;
	}

	get title(): string {
		return this.props.title;
	}

	get content(): string {
		return this.props.content;
	}

	get slug(): Slug {
		return this.props.slug;
	}

	get attachments(): Attachment[] {
		return this.props.attachments;
	}

	get bestAnswerId(): UniqueEntityId | null | undefined {
		return this.props.bestAnswerId;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | null | undefined {
		return this.props.updatedAt;
	}

	static create(props: QuestionDetailsProps): QuestionDetails {
		return new QuestionDetails(props);
	}
}
