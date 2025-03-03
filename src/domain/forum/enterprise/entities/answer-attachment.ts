import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Props {
	answerId: UniqueEntityId;
	attachmentId: UniqueEntityId;
}

export class AnswerAttachment extends Entity<Props> {
	get answerId(): UniqueEntityId {
		return this.props.answerId;
	}

	get attachmentId(): UniqueEntityId {
		return this.props.attachmentId;
	}

	static create(props: Props, id?: UniqueEntityId): AnswerAttachment {
		const attachment = new AnswerAttachment(
			{
				...props,
			},
			id,
		);
		return attachment;
	}
}

export { Props as AnswerAttachmentProps };
