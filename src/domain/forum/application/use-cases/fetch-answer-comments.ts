import { right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';

interface FetchAnswerCommentsPayload {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsResult = Either<
	null,
	{
		comments: CommentWithAuthor[];
	}
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentRepository: AnswerCommentRepository) {}
	async execute({
		answerId,
		page,
	}: FetchAnswerCommentsPayload): Promise<FetchAnswerCommentsResult> {
		const comments =
			await this.answerCommentRepository.findManyByAnswerIdWithAuthor(
				answerId,
				{
					page,
				},
			);

		return right({ comments });
	}
}
