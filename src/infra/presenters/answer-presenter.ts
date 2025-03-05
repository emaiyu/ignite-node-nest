import type { Answer } from '@/domain/forum/enterprise/entities/answer';
type Result = {
	id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date | null | undefined;
};
export class AnswerPresenter {
	static toHTTP(answer: Answer): Result {
		return {
			id: answer.id.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}

export { Result as ToHTTP };
