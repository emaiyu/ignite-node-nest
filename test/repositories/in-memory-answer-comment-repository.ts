import type { PaginationParams } from '@/core/repositories/paginate-params';
import type { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import type { InMemoryStudentRepository } from './in-memory-student-repository';

export class InMemoryAnswerCommentRepository
	implements AnswerCommentRepository
{
	public items: AnswerComment[] = [];
	constructor(private studentRepository: InMemoryStudentRepository) {}
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

	async findManyByAnswerIdWithAuthor(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20)
			.map((comment) => {
				const author = this.studentRepository.items.find((student) => {
					return student.id.equals(comment.authorId);
				});

				if (!author) {
					throw new Error(
						`Author with ID "${comment.authorId.toString()} does not exist."`,
					);
				}

				return CommentWithAuthor.create({
					commentId: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					authorId: comment.authorId,
					author: author.name,
				});
			});

		return Promise.resolve(answerComments);
	}
}
