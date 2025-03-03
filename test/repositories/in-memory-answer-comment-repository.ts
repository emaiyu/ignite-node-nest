import type { PaginationParams } from '@/core/repositories/paginate-params';
import type { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentRepository
	implements AnswerCommentRepository
{
	public items: AnswerComment[] = [];

	async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment);
		return Promise.resolve();
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find(
			(item) => item.id.toString() === id?.toString(),
		);
		if (!answerComment) return null;
		return Promise.resolve(answerComment);
	}

	async findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]> {
		const questionComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((params.page - 1) * 20, params.page * 20);
		return Promise.resolve(questionComments);
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === answerComment.id.toString(),
		);

		this.items.splice(itemIndex, 1);
		return Promise.resolve();
	}
}
