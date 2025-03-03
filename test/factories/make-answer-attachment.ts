import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/answer-attachment';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export function makeAnswerAttachment(
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityId,
): AnswerAttachment {
	const answerAttachment = AnswerAttachment.create(
		{
			answerId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	);
	return answerAttachment;
}
