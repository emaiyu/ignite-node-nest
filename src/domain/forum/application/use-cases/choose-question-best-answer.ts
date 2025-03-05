import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import { Injectable } from '@nestjs/common';
import type { Question } from '../../enterprise/entities/question';
import { AnswerRepository } from '../repositories/answer-repository';
import { QuestionRepository } from '../repositories/question-repository';

interface ChooseQuestionBestAnswerPayload {
	answerId: string;
	authorId: string;
}

type ChooseQuestionBestAnswerResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private questionRepository: QuestionRepository,
		private answerRepository: AnswerRepository,
	) {}
	async execute(
		payload: ChooseQuestionBestAnswerPayload,
	): Promise<ChooseQuestionBestAnswerResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) return left(new ResourceNotFoundError());

		const question = await this.questionRepository.findById(
			answer.questionId.toString(),
		);
		if (!question) return left(new ResourceNotFoundError());

		if (question.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		question.bestAnswerId = answer.id;

		await this.questionRepository.save(question);

		return right({ question });
	}
}
