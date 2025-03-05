import type { PaginationParams } from '@/core/repositories/paginate-params';
import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import type { InMemoryStudentRepository } from './in-memory-student-repository';

export class InMemoryQuestionCommentRepository
	implements QuestionCommentRepository
{
	public items: QuestionComment[] = [];

	constructor(private studentsRepository: InMemoryStudentRepository) {}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find(
			(item) => item.id.toString() === id,
		);

		if (!questionComment) {
			return null;
		}

		return Promise.resolve(questionComment);
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return Promise.resolve(questionComments);
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)
			.map((comment) => {
				const author = this.studentsRepository.items.find((student) => {
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

		return Promise.resolve(questionComments);
	}

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);

		return Promise.resolve();
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		);

		this.items.splice(itemIndex, 1);
		return Promise.resolve();
	}
}
