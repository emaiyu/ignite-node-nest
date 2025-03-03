import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeAnswerComment } from '@/factories/make-answer-comment';
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository';

import { DeleteAnswerCommentUseCase } from './delete-answer-comment';

let answerCommentRepository: InMemoryAnswerCommentRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment', function () {
	beforeEach(function () {
		answerCommentRepository = new InMemoryAnswerCommentRepository();
		sut = new DeleteAnswerCommentUseCase(answerCommentRepository);
	});

	it('should be able to delete a answer delete', async () => {
		const answerComment = makeAnswerComment();

		await answerCommentRepository.create(answerComment);

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		});

		expect(answerCommentRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityId('author-1'),
		});

		await answerCommentRepository.create(answerComment);

		// await expect(function () {
		// 	return sut.execute({
		// 		answerCommentId: answerComment.id.toString(),
		// 		authorId: 'author-2',
		// 	});
		// }).rejects.toBeInstanceOf(Error);

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
