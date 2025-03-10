import type { PaginationParams } from '@/core/repositories/paginate-params';

import type { AnswerComment } from '../../enterprise/entities/answer-comment';
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class AnswerCommentRepository {
	abstract create(answerComment: AnswerComment): Promise<void>;
	abstract findById(id: string): Promise<AnswerComment | null>;
	abstract findManyByAnswerId(
		questionId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]>;
	abstract delete(answerComment: AnswerComment): Promise<void>;

	abstract findManyByAnswerIdWithAuthor(
		answerId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]>;
}
