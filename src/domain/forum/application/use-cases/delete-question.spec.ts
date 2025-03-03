import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeQuestion } from '@/factories/make-question';
import { makeQuestionAttachment } from '@/factories/make-question-attachment';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';

import { DeleteQuestionUseCase } from './delete-question';

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: DeleteQuestionUseCase;

describe('Delete Question', function () {
	beforeEach(function () {
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		sut = new DeleteQuestionUseCase(questionRepository);
	});

	it('should be able to delete a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		questionAttachmentRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		);

		await sut.execute({
			questionId: 'question-1',
			authorId: 'author-1',
		});

		expect(questionRepository.items).toHaveLength(0);
		expect(questionAttachmentRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		// await expect(function () {
		// 	return sut.execute({
		// 		questionId: 'question-1',
		// 		authorId: 'author-2',
		// 	});
		// }).rejects.toBeInstanceOf(Error);

		const result = await sut.execute({
			questionId: 'question-1',
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
