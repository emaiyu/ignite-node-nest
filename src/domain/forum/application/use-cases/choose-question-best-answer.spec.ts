import { beforeEach, describe, expect, it } from 'vitest';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeAnswer } from '@/factories/make-answer';
import { makeQuestion } from '@/factories/make-question';
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';

import { ChooseQuestionBestAnswerQuestionUseCase } from './choose-question-best-answer';

let answerRepository: InMemoryAnswerRepository;
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let questionRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: ChooseQuestionBestAnswerQuestionUseCase;

describe('Choose Question Best Answer', function () {
	beforeEach(function () {
		answerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentRepository);
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		sut = new ChooseQuestionBestAnswerQuestionUseCase(
			questionRepository,
			answerRepository,
		);
	});

	it('should be able to choose the question a best answer', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		await questionRepository.create(question);
		await answerRepository.create(answer);

		await sut.execute({
			answerId: answer.id?.toString(),
			authorId: question.authorId.toString(),
		});

		expect(questionRepository.items[0].bestAnswerId).toEqual(answer.id);
	});

	it('should not be able to choose another user question best answer', async () => {
		const question = makeQuestion({
			authorId: new UniqueEntityId('author-1'),
		});
		const answer = makeAnswer({ questionId: question.id });

		await questionRepository.create(question);
		await answerRepository.create(answer);

		// await expect(function () {
		// 	return sut.execute({
		// 		answerId: answer.id?.toString(),
		// 		authorId: 'author-2',
		// 	});
		// }).rejects.toBeInstanceOf(Error);

		const result = await sut.execute({
			answerId: answer.id?.toString(),
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
