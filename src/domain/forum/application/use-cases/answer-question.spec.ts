import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository';
import { AnswerQuestionUseCase } from './answer-question';

let answerRepository: InMemoryAnswerRepository;
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository;

let sut: AnswerQuestionUseCase;

describe('Answer question', function () {
	beforeEach(function () {
		answerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentRepository);
		sut = new AnswerQuestionUseCase(answerRepository);
	});

	it('should be able to answer a question', async () => {
		const result = await sut.execute({
			instructorId: '1',
			questionId: '1',
			content: 'Nova resposta',
			attachmentsId: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);

		expect(answerRepository.items[0]).toEqual(result.value?.answer);

		expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answerRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
