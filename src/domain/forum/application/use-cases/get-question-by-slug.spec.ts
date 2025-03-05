/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeAttachment } from '@/factories/make-attachement';
import { makeQuestionAttachment } from '@/factories/make-question-attachment';
import { InMemoryAttachmentRepository } from '@/repositories/in-memory-attachment-repository';
import { InMemoryQuestionAttachmentRepository } from '@/repositories/in-memory-question-attachment-repository';
import { InMemoryQuestionRepository } from '@/repositories/in-memory-question-repository';
import { InMemoryStudentRepository } from '@/repositories/in-memory-student-repository';
import { makeQuestion } from 'test/factories/make-question';
import { makeStudent } from 'test/factories/make-student';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
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
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const student = makeStudent({ name: 'John Doe' });

		await inMemoryStudentsRepository.create(student);

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create('example-question'),
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const attachment = makeAttachment({
			title: 'Some attachment',
		});

		inMemoryAttachmentsRepository.items.push(attachment);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			}),
		);

		const result = await sut.execute({
			slug: 'example-question',
		});

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: attachment.title,
					}),
				],
			}),
		});
	});
});
