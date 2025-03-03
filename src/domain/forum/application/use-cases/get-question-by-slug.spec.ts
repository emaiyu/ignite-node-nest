import { beforeEach, describe, expect, it } from 'vitest';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestion } from '@/factories/make-question';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';

import { GetQuestionBySlugUseCase } from './get-question-by-slug';

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
	beforeEach(() => {
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		sut = new GetQuestionBySlugUseCase(questionRepository);
	});

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create('example-question'),
		});

		await questionRepository.create(newQuestion);

		const result = await sut.execute({
			slug: 'example-question',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
			}),
		});
	});
});
