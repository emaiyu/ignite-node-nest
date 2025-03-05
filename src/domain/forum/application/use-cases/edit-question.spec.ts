import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { makeQuestionAttachment } from '@/factories/make-question-attachment';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { EditQuestionUseCase } from './edit-question';

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
	beforeEach(() => {
		questionAttachmentRepository = new InMemoryQuestionAttachmentRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);

		sut = new EditQuestionUseCase(
			questionRepository,
			questionAttachmentRepository,
		);
	});

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		questionAttachmentRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		);

		await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-1',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsId: ['1', '3'],
		});

		expect(questionRepository.items[0]).toMatchObject({
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
		});

		expect(questionRepository.items[0].attachments.currentItems).toHaveLength(
			2,
		);
		expect(questionRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-2',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsId: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	it('should sync new and removed attachment when editing a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		);

		await questionRepository.create(newQuestion);

		questionAttachmentRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		);

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-1',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsId: ['1', '3'],
		});

		expect(result.isRight()).toBe(true);
		expect(questionAttachmentRepository.items).toHaveLength(2);
		expect(questionAttachmentRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('3'),
				}),
			]),
		);
	});
});
