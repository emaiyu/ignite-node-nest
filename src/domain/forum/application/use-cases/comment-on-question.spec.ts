import { beforeEach, describe, expect, it } from 'vitest';

import { makeQuestion } from '@/factories/make-question';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';

import { CommentOnQuestionUseCase } from './comment-on-question';

let questionRepository: InMemoryQuestionRepository;
let questionCommentRepository: InMemoryQuestionCommentRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;

let sut: CommentOnQuestionUseCase;

describe('Comment On Question', function () {
	beforeEach(function () {
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		questionCommentRepository = new InMemoryQuestionCommentRepository();
		sut = new CommentOnQuestionUseCase(
			questionRepository,
			questionCommentRepository,
		);
	});

	it('should be able to comment on question', async () => {
		const question = makeQuestion();
		await questionRepository.create(question);

		await sut.execute({
			authorId: question.authorId.toString(),
			questionId: question.id.toString(),
			content: 'Teste',
		});

		expect(questionCommentRepository.items[0].content).toEqual('Teste');
	});
});
