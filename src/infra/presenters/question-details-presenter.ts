import type { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import type { ToHTTP as Attachment } from './attachment-presenter';
import { AttachmentPresenter } from './attachment-presenter';

export type ToHTTP = {
	questionId: string;
	authorId: string;
	author: string;
	title: string;
	content: string;
	slug: string;
	bestAnswerId: string | undefined;
	attachments: Attachment[];
	createdAt: Date;
	updatedAt: Date | null | undefined;
};

export class QuestionDetailsPresenter {
	static toHTTP(questionDetails: QuestionDetails): ToHTTP {
		return {
			questionId: questionDetails.questionId.toString(),
			authorId: questionDetails.authorId.toString(),
			author: questionDetails.author,
			title: questionDetails.title,
			content: questionDetails.content,
			slug: questionDetails.slug.value,
			bestAnswerId: questionDetails.bestAnswerId?.toString(),
			attachments: questionDetails.attachments.map((item) =>
				AttachmentPresenter.toHTTP(item),
			),
			createdAt: questionDetails.createdAt,
			updatedAt: questionDetails.updatedAt,
		};
	}
}
