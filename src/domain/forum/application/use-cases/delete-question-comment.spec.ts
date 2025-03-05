import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';
import { makeQuestionComment } from '@/factories/make-question-comment';
import { InMemoryQuestionCommentRepository } from '@/repositories/in-memory-question-comment-repository';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment', () => {
	beforeEach(() => {
		inMemoryStudentRepository = new InMemoryStudentRepository();
		inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
			inMemoryStudentRepository,
		);

		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository);
	});

	it('should be able to delete a question comment', async () => {
		const questionComment = makeQuestionComment();

		await inMemoryQuestionCommentRepository.create(questionComment);

		await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		});

		expect(inMemoryQuestionCommentRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user question comment', async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityId('author-1'),
		});

		await inMemoryQuestionCommentRepository.create(questionComment);

		const result = await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
