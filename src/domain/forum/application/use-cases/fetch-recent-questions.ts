import { right, type Either } from '@/core/either';
import type { Question } from '@/domain/forum/enterprise/entities/question';

import type { QuestionRepository } from '../repositories/question-repository';

interface FetchRecentQuestionPayload {
	page: number;
}

type FetchRecentQuestionResult = Either<
	null,
	{
		questions: Question[];
	}
>;

export class FetchRecentQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(
		payload: FetchRecentQuestionPayload,
	): Promise<FetchRecentQuestionResult> {
		const questions = await this.questionRepository.findManyRecent(payload);
		return right({ questions });
	}
}
