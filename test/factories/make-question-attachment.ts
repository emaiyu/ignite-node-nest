import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { QuestionAttachmentProps } from '@/domain/forum/enterprise/entities/question-attachment';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
): QuestionAttachment {
	const questionAttachment = QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	);
	return questionAttachment;
}
