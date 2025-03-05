import { right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import type { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';

interface FetchAnswerCommentsPayload {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsResult = Either<
	null,
	{
		answerComments: AnswerComment[];
	}
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentRepository: AnswerCommentRepository) {}
	async execute({
		answerId,
		...params
	}: FetchAnswerCommentsPayload): Promise<FetchAnswerCommentsResult> {
		const answerComments =
			await this.answerCommentRepository.findManyByAnswerId(answerId, params);
		return right({ answerComments });
	}
}
