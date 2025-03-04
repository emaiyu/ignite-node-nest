import type { PaginationParams } from '@/core/repositories/paginate-params';

import type { QuestionComment } from '../../enterprise/entities/question-comment';

export abstract class QuestionCommentRepository {
	abstract create(questionComment: QuestionComment): Promise<void>;
	abstract findById(id: string): Promise<QuestionComment | null>;
	abstract findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]>;
	abstract delete(questionComment: QuestionComment): Promise<void>;
}
