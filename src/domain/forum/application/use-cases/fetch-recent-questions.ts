import { Either, right } from '@/core/either';
import { Question } from '@/domain/forum/enterprise/entities/question';

import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../repositories/question-repository';

interface FetchRecentQuestionPayload {
	page: number;
}

type FetchRecentQuestionResult = Either<
	null,
	{
		questions: Question[];
	}
>;

@Injectable()
export class FetchRecentQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(
		payload: FetchRecentQuestionPayload,
	): Promise<FetchRecentQuestionResult> {
		const questions = await this.questionRepository.findManyRecent(payload);
		return right({ questions });
	}
}
