import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import { QuestionComment } from '../../enterprise/entities/question-comment';
import type { QuestionCommentRepository } from '../repositories/question-comment-repository';
import type { QuestionRepository } from '../repositories/question-repository';

interface CommentOnQuestionPayload {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionResult = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment;
	}
>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionRepository: QuestionRepository,
		private questionCommentRepository: QuestionCommentRepository,
	) {}
	async execute(
		payload: CommentOnQuestionPayload,
	): Promise<CommentOnQuestionResult> {
		const question = await this.questionRepository.findById(payload.questionId);

		if (!question) return left(new ResourceNotFoundError());

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityId(payload.authorId),
			questionId: new UniqueEntityId(payload.questionId),
			content: payload.content,
		});

		await this.questionCommentRepository.create(questionComment);

		return right({
			questionComment,
		});
	}
}
