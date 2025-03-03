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
		const question = this.items.find(
			(item) => item.id.toString() === id?.toString(),
		);
		if (!question) return null;
		return Promise.resolve(question);
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);
		if (!question) return null;
		return Promise.resolve(question);
	}

	async findManyRecent(params: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((params.page - 1) * 20, params.page * 20);

		return Promise.resolve(questions);
	}

	async create(question: Question): Promise<void> {
		this.items.push(question);
		DomainEvents.dispatchEventsForAggregate(question.id);
		return Promise.resolve();
	}

	async save(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);

		this.items[itemIndex] = question;
		DomainEvents.dispatchEventsForAggregate(question.id);
		return Promise.resolve();
	}

	async delete(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);

		this.items.splice(itemIndex, 1);
		await this.questionAttachmentRepository.deleteManyByQuestionId(
			question.id.toString(),
		);
		return Promise.resolve();
	}
}
