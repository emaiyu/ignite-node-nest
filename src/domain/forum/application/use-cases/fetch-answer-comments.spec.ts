import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from '@/factories/make-answer-comment';
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository';

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

let answerCommentRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', function () {
	beforeEach(function () {
		answerCommentRepository = new InMemoryAnswerCommentRepository();
		sut = new FetchAnswerCommentsUseCase(answerCommentRepository);
	});

	it('should be able to fetch answer comments', async () => {
		await answerCommentRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }),
		);
		await answerCommentRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }),
		);
		await answerCommentRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }),
		);

		const result = await sut.execute({
			answerId: 'answer-id',
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments).toHaveLength(3);
	});

	it('should be able to fetch paginated answer comments', async () => {
		for (let i = 1; i <= 22; i++) {
			await answerCommentRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }),
			);
		}

		const result = await sut.execute({
			answerId: 'answer-id',
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments).toHaveLength(2);
	});
});
