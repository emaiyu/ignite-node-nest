import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';
import { makeQuestion } from 'test/factories/make-question';
import { FetchRecentQuestionUseCase } from './fetch-recent-questions';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentRepository;
let sut: FetchRecentQuestionUseCase;

describe('Fetch Recent Questions', () => {
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
		sut = new FetchRecentQuestionUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to fetch recent questions', async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 20) }),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 18) }),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 23) }),
		);

		const result = await sut.execute({
			page: 1,
		});

		expect(result.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
		]);
	});

	it('should be able to fetch paginated recent questions', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion());
		}

		const result = await sut.execute({
			page: 2,
		});

		expect(result.value?.questions).toHaveLength(2);
	});
});
