import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryQuestionsRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentRepository();
		inMemoryStudentsRepository = new InMemoryStudentRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository(
			inMemoryStudentsRepository,
		);

		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository,
		);
	});

	it('should be able to comment on question', async () => {
		const question = makeQuestion();

		await inMemoryQuestionsRepository.create(question);

		await sut.execute({
			questionId: question.id.toString(),
			authorId: question.authorId.toString(),
			content: 'Comentário teste',
		});

		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
			'Comentário teste',
		);
	});
});
