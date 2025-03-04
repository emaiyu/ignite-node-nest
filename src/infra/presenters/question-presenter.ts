import type { Question } from '@/domain/forum/enterprise/entities/question';

type Result = {
	id: string;
	title: string;
	slug: string;
	bestAnswerId: string | undefined;
	createdAt: Date;
	updatedAt: Date | null | undefined;
};

export class QuestionPresenter {
	static toHTTP(question: Question): Result {
		return {
			id: question.id.toString(),
			title: question.title,
			slug: question.slug.value,
			bestAnswerId: question?.bestAnswerId?.toString(),
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}

export { Result as ToHTTP };
