import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository';
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';
import { makeAnswer } from 'test/factories/make-answer';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswerRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let inMemoryStudentsRepository: InMemoryStudentRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentRepository();
		inMemoryStudentsRepository = new InMemoryStudentRepository();
		inMemoryAnswersRepository = new InMemoryAnswerRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository(
			inMemoryStudentsRepository,
		);

		sut = new CommentOnAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerCommentsRepository,
		);
	});

	it('should be able to comment on answer', async () => {
		const answer = makeAnswer();

		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			answerId: answer.id.toString(),
			authorId: answer.authorId.toString(),
			content: 'Comentário teste',
		});

		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
			'Comentário teste',
		);
	});
});
