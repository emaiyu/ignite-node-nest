import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import type { QuestionRepository } from '../repositories/question-repository';

interface DeleteQuestionPayload {
	authorId: string;
	questionId: string;
}

type DeleteQuestionResult = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

export class DeleteQuestionUseCase {
	constructor(private questionRepository: QuestionRepository) {}
	async execute(payload: DeleteQuestionPayload): Promise<DeleteQuestionResult> {
		const question = await this.questionRepository.findById(payload.questionId);
		if (!question) return left(new ResourceNotFoundError());
		if (question.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());
		await this.questionRepository.delete(question);
		return right(null);
	}
}
