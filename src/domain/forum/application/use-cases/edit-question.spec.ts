import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeQuestion } from '@/factories/make-question';
import { makeQuestionAttachment } from '@/factories/make-question-attachment';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';

import { EditQuestionUseCase } from './edit-question';

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', function () {
	beforeEach(function () {
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		sut = new EditQuestionUseCase(
			questionRepository,
			questionAttachmentRepository,
		);
	});

	it('should be able to edit a question', async () => {
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
			questionId: newQuestion.id?.toValue(),
			authorId: 'author-1',
			title: 'Pergunta 1',
			content: 'Conteúdo da pergunta 1',
			attachmentsId: ['1', '3'],
		});

		expect(questionRepository.items[0]).toMatchObject({
			title: 'Pergunta 1',
			content: 'Conteúdo da pergunta 1',
		});

		expect(questionRepository.items[0].attachments.currentItems).toHaveLength(
			2,
		);
		expect(questionRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		// await expect(function () {
		// 	return sut.execute({
		// 		questionId: newQuestion.id?.toValue(),
		// 		authorId: 'author-2',
		// 		title: 'Pergunta 1',
		// 		content: 'Conteúdo da pergunta 1',
		// 	});
		// }).rejects.toBeInstanceOf(Error);

		const result = await sut.execute({
			questionId: newQuestion.id?.toValue(),
			authorId: 'author-2',
			title: 'Pergunta 1',
			content: 'Conteúdo da pergunta 1',
			attachmentsId: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
