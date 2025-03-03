import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

interface Props {
	recipientId: UniqueEntityId;
	title: string;
	content: string;
	readAt?: Date;
	createdAt: Date;
}

export class Notification extends Entity<Props> {
	get recipientId(): UniqueEntityId {
		return this.props.recipientId;
	}

	get title(): string {
		return this.props.title;
	}

	get content(): string {
		return this.props.content;
	}

	get readAt(): Date | undefined {
		return this.props.readAt;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	read(): void {
		this.props.readAt = new Date();
	}

	static create(
		props: Optional<Props, 'createdAt'>,
		id?: UniqueEntityId,
	): Notification {
		const notification = new Notification(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return notification;
	}
}

export { Props as NotificationProps };
