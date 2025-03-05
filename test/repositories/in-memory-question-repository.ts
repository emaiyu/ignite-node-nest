import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/paginate-params';
import type { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import type { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionRepository implements QuestionRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentRepository: QuestionAttachmentRepository,
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

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return Promise.resolve(questions);
	}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		await this.questionAttachmentRepository.createMany(
			question.attachments.getItems(),
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[itemIndex] = question;

		await this.questionAttachmentRepository.createMany(
			question.attachments.getNewItems(),
		);

		await this.questionAttachmentRepository.deleteMany(
			question.attachments.getRemovedItems(),
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(itemIndex, 1);

		await this.questionAttachmentRepository.deleteManyByQuestionId(
			question.id.toString(),
		);
	}
}
