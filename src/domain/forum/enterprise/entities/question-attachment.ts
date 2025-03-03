import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface Props {
	questionId: UniqueEntityId;
	attachmentId: UniqueEntityId;
}

export class QuestionAttachment extends Entity<Props> {
	get questionId(): UniqueEntityId {
		return this.props.questionId;
	}

	get attachmentId(): UniqueEntityId {
		return this.props.attachmentId;
	}

	static create(props: Props, id?: UniqueEntityId): QuestionAttachment {
		const attachment = new QuestionAttachment(
			{
				...props,
			},
			id,
		);
		return attachment;
	}
}

export { Props as QuestionAttachmentProps };
