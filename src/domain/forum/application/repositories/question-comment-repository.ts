import type { PaginationParams } from '@/core/repositories/paginate-params';

import type { QuestionComment } from '../../enterprise/entities/question-comment';
import type { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class QuestionCommentRepository {
	abstract create(questionComment: QuestionComment): Promise<void>;
	abstract findById(id: string): Promise<QuestionComment | null>;
	abstract findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]>;
	abstract delete(questionComment: QuestionComment): Promise<void>;
	abstract findManyByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]>;
}
