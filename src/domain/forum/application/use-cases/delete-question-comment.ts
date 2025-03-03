/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import type { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface DeleteQuestionCommentPayload {
	authorId: string;
	questionCommentId: string;
}

type DeleteQuestionCommentResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>;

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentRepository: QuestionCommentRepository) {}
	async execute(
		payload: DeleteQuestionCommentPayload,
	): Promise<DeleteQuestionCommentResult> {
		const questionComment = await this.questionCommentRepository.findById(
			payload.questionCommentId,
		);

		if (!questionComment) return left(new ResourceNotFoundError());

		if (questionComment.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		await this.questionCommentRepository.delete(questionComment);

		return right({});
	}
}
