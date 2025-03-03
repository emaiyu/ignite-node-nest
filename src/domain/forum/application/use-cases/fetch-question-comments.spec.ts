import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from '@/factories/make-question-comment';
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository';

import { FetchQuestionCommentsUseCase } from './fetch-question-comments';

let questionCommentRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', function () {
	beforeEach(function () {
		questionCommentRepository = new InMemoryQuestionCommentRepository();
		sut = new FetchQuestionCommentsUseCase(questionCommentRepository);
	});

	it('should be able to fetch question comments', async () => {
		await questionCommentRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-id') }),
		);
		await questionCommentRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-id') }),
		);
		await questionCommentRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-id') }),
		);

		const result = await sut.execute({
			questionId: 'question-id',
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questionComments).toHaveLength(3);
	});

	it('should be able to fetch paginated question comments', async () => {
		for (let i = 1; i <= 22; i++) {
			await questionCommentRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('question-id') }),
			);
		}

		const result = await sut.execute({
			questionId: 'question-id',
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questionComments).toHaveLength(2);
	});
});
