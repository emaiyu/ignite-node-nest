import { right, type Either } from '@/core/either';

import { Injectable } from '@nestjs/common';
import type { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';

interface FetchQuestionCommentsPayload {
	questionId: string;
	page: number;
}

type FetchQuestionCommentsResult = Either<
	null,
	{
		questionComments: QuestionComment[];
	}
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentRepository: QuestionCommentRepository) {}
	async execute({
		questionId,
		...params
	}: FetchQuestionCommentsPayload): Promise<FetchQuestionCommentsResult> {
		const questionComments =
			await this.questionCommentRepository.findManyByQuestionId(
				questionId,
				params,
			);
		return right({ questionComments });
	}
}
