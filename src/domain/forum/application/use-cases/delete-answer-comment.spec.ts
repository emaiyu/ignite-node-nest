import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeAnswerComment } from '@/factories/make-answer-comment';
import { InMemoryAnswerCommentRepository } from '@/repositories/in-memory-answer-comment-repository';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentRepository;
let inMemoryStudentsRepository: InMemoryStudentRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentRepository();
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentRepository(
			inMemoryStudentsRepository,
		);

		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to delete a answer comment', async () => {
		const answerComment = makeAnswerComment();

		await inMemoryAnswerCommentsRepository.create(answerComment);

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityId('author-1'),
		});

		await inMemoryAnswerCommentsRepository.create(answerComment);

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: 'author-2',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
