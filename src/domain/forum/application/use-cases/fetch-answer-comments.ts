import { right, type Either } from '@/core/either';

import type { AnswerComment } from '../../enterprise/entities/answer-comment';
import type { AnswerCommentRepository } from '../repositories/answer-comment-repository';

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
