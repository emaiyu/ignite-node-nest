import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import { Injectable } from '@nestjs/common';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';

interface DeleteAnswerCommentPayload {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentResult = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

@Injectable()
export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentRepository: AnswerCommentRepository) {}
	async execute(
		payload: DeleteAnswerCommentPayload,
	): Promise<DeleteAnswerCommentResult> {
		const answerComment = await this.answerCommentRepository.findById(
			payload.answerCommentId,
		);

		if (!answerComment) return left(new ResourceNotFoundError());

		if (answerComment.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		await this.answerCommentRepository.delete(answerComment);

		return right(null);
	}
}
