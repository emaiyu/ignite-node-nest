import { right, type Either } from '@/core/either';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

import { Injectable } from '@nestjs/common';
import { AnswerRepository } from '../repositories/answer-repository';

interface FetchQuestionAnswersPayload {
	questionId: string;
	page: number;
}

type FetchQuestionAnswersResult = Either<
	null,
	{
		answers: Answer[];
	}
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute({
		questionId,
		...payload
	}: FetchQuestionAnswersPayload): Promise<FetchQuestionAnswersResult> {
		const answers = await this.answerRepository.findManyByQuestionId(
			questionId,
			payload,
		);
		return right({ answers });
	}
}
