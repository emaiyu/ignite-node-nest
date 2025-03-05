import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { InMemoryAnswerAttachmentRepository } from '@/repositories/in-memory-answer-attachment-repository';
import { InMemoryAnswerRepository } from '@/repositories/in-memory-answer-repository';

let answerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let answerRepository: InMemoryAnswerRepository;
let sut: AnswerQuestionUseCase;

describe('Create Answer', () => {
	beforeEach(() => {
		answerAttachmentRepository = new InMemoryAnswerAttachmentRepository();
		answerRepository = new InMemoryAnswerRepository(answerAttachmentRepository);
		sut = new AnswerQuestionUseCase(answerRepository);
	});

	it('should be able to create a answer', async () => {
		const result = await sut.execute({
			questionId: '1',
			authorId: '1',
			content: 'Conteúdo da resposta',
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

	it('should persist attachments when creating a new answer', async () => {
		const result = await sut.execute({
			questionId: '1',
			authorId: '1',
			content: 'Conteúdo da resposta',
			attachmentsId: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(answerAttachmentRepository.items).toHaveLength(2);
		expect(answerAttachmentRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
				}),
			]),
		);
	});
});
