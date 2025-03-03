import { beforeEach, describe, expect, it } from 'vitest';

import { makeQuestion } from '@/factories/make-question';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';

import { FetchRecentQuestionUseCase } from './fetch-recent-questions';

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: FetchRecentQuestionUseCase;

describe('Fetch Recent Question', function () {
	beforeEach(function () {
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		sut = new FetchRecentQuestionUseCase(questionRepository);
	});

	it('should be able to fetch recent question', async () => {
		await questionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 20),
			}),
		);
		await questionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 18),
			}),
		);
		await questionRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 23),
			}),
		);

		const result = await sut.execute({
			page: 1,
		});

		expect(result.isRight()).toBe(true);

		expect(result.value?.questions).toHaveLength(3);
		expect(result.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
		]);
	});

	it('should be able to fetch paginated recent question', async () => {
		for (let i = 1; i <= 22; i++) {
			await questionRepository.create(makeQuestion({}));
		}

		const result = await sut.execute({
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.questions).toHaveLength(2);
	});
});
