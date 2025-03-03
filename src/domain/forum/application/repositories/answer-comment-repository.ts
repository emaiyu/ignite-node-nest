import type { PaginationParams } from '@/core/repositories/paginate-params';

import type { AnswerComment } from '../../enterprise/entities/answer-comment';

export interface AnswerCommentRepository {
	create(answerComment: AnswerComment): Promise<void>;
	findById(id: string): Promise<AnswerComment | null>;
	findManyByAnswerId(
		questionId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]>;
	delete(answerComment: AnswerComment): Promise<void>;
}
