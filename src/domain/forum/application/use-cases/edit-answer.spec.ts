import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeAnswer } from '@/factories/make-answer';
import { makeAnswerAttachment } from '@/factories/make-answer-attachment';
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository';

import { EditAnswerUseCase } from './edit-answer';

let answerRepository: InMemoryAnswerRepository;
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', function () {
	beforeEach(function () {
		answerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentRepository);
		sut = new EditAnswerUseCase(answerRepository, answerAttachmentRepository);
	});

	it('should be able to edit a answer', async () => {
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
			answerId: newAnswer.id?.toValue(),
			authorId: 'author-1',
			content: 'Conteúdo da pergunta 1',
			attachmentsId: ['1', '3'],
		});

		expect(answerRepository.items[0]).toMatchObject({
			content: 'Conteúdo da pergunta 1',
		});

		expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answerRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('answer-1'),
		);

		await answerRepository.create(newAnswer);

		// await expect(function () {
		// 	return sut.execute({
		// 		answerId: newAnswer.id?.toValue(),
		// 		authorId: 'author-2',
		// 		content: 'Conteúdo da pergunta 1',
		// 	});
		// }).rejects.toBeInstanceOf(Error);
		const result = await sut.execute({
			answerId: newAnswer.id?.toValue(),
			authorId: 'author-2',
			content: 'Conteúdo da pergunta 1',
			attachmentsId: [],
		});
		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
