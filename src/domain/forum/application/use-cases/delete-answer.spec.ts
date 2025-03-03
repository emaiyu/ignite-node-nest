import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeAnswer } from '@/factories/make-answer';
import { makeAnswerAttachment } from '@/factories/make-answer-attachment';
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository';

import { DeleteAnswerUseCase } from './delete-answer';

let answerRepository: InMemoryAnswerRepository;
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', function () {
	beforeEach(function () {
		answerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentRepository);
		sut = new DeleteAnswerUseCase(answerRepository);
	});

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('answer-1'),
		);

		await answerRepository.create(newAnswer);

		answerAttachmentRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		);

		await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-1',
		});

		expect(answerRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('answer-1'),
		);

		await answerRepository.create(newAnswer);

		// await expect(function () {
		// 	return sut.execute({
		// 		answerId: 'answer-1',
		// 		authorId: 'author-2',
		// 	});
		// }).rejects.toBeInstanceOf(Error);
		const result = await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
