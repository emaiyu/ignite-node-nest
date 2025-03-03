import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityId,
): QuestionComment {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
	return questionComment;
}
