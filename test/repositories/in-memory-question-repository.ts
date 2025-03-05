import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/paginate-params';
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import type { InMemoryAttachmentRepository } from './in-memory-attachment-repository';
import type { InMemoryQuestionAttachmentRepository } from './in-memory-question-attachment-repository';
import type { InMemoryStudentRepository } from './in-memory-student-repository';

export class InMemoryQuestionRepository implements QuestionRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
		private attachmentsRepository: InMemoryAttachmentRepository,
		private studentsRepository: InMemoryStudentRepository,
	) {}

	async findById(id: string): Promise<Question | null> {
		const question = this.items.find((item) => item.id.toString() === id);

		if (!question) {
			return null;
		}

		return Promise.resolve(question);
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) {
			return null;
		}

		return Promise.resolve(question);
	}

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) {
			return null;
		}

		const author = this.studentsRepository.items.find((student) => {
			return student.id.equals(question.authorId);
		});

		if (!author) {
			throw new Error(
				`Author with ID "${question.authorId.toString()}" does not exist.`,
			);
		}

		const questionAttachments = this.questionAttachmentsRepository.items.filter(
			(questionAttachment) => {
				return questionAttachment.questionId.equals(question.id);
			},
		);

		const attachments = questionAttachments.map((questionAttachment) => {
			const attachment = this.attachmentsRepository.items.find((attachment) => {
				return attachment.id.equals(questionAttachment.attachmentId);
			});

			if (!attachment) {
				throw new Error(
					`Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
				);
			}

			return attachment;
		});

		return Promise.resolve(
			QuestionDetails.create({
				questionId: question.id,
				authorId: question.authorId,
				author: author.name,
				title: question.title,
				slug: question.slug,
				content: question.content,
				bestAnswerId: question.bestAnswerId,
				attachments,
				createdAt: question.createdAt,
				updatedAt: question.updatedAt,
			}),
		);
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return Promise.resolve(questions);
	}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[itemIndex] = question;

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getNewItems(),
		);

		await this.questionAttachmentsRepository.deleteMany(
			question.attachments.getRemovedItems(),
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(itemIndex, 1);

		await this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toString(),
		);
	}
}
