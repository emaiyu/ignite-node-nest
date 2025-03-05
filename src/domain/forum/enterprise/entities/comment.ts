import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface CommentProps {
	authorId: UniqueEntityId;
	content: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export abstract class Comment<
	Props extends CommentProps,
> extends Entity<Props> {
	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get content(): string {
		return this.props.content;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | undefined | null {
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
}
