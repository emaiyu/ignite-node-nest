import { beforeEach, describe, expect, it } from 'vitest';

import { makeAnswer } from '@/factories/make-answer';
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository';
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository';

import { CommentOnAnswerUseCase } from './comment-on-answer';

let answerRepository: InMemoryAnswerRepository;
let answerCommentRepository: InMemoryAnswerCommentRepository;
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository;

let sut: CommentOnAnswerUseCase;

describe('Comment On Answer', function () {
	beforeEach(function () {
		answerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentRepository);
		answerCommentRepository = new InMemoryAnswerCommentRepository();
		sut = new CommentOnAnswerUseCase(answerRepository, answerCommentRepository);
	});

	it('should be able to comment on answer', async () => {
		const answer = makeAnswer();
		await answerRepository.create(answer);

		await sut.execute({
			authorId: answer.authorId.toString(),
			answerId: answer.id.toString(),
			content: 'Teste',
		});

		expect(answerCommentRepository.items[0].content).toEqual('Teste');
	});
});
