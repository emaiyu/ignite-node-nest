import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeQuestionComment } from '@/factories/make-question-comment';
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository';

import { DeleteQuestionCommentUseCase } from './delete-question-comment';

let questionCommentRepository: InMemoryQuestionCommentRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment', function () {
	beforeEach(function () {
		questionCommentRepository = new InMemoryQuestionCommentRepository();
		sut = new DeleteQuestionCommentUseCase(questionCommentRepository);
	});

	it('should be able to delete a question delete', async () => {
		const questionComment = makeQuestionComment();

		await questionCommentRepository.create(questionComment);

		await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		});

		expect(questionCommentRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user question comment', async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityId('author-1'),
		});

		await questionCommentRepository.create(questionComment);

		// await expect(function () {
		// 	return sut.execute({
		// 		questionCommentId: questionComment.id.toString(),
		// 		authorId: 'author-2',
		// 	});
		// }).rejects.toBeInstanceOf(Error);
		const result = await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
