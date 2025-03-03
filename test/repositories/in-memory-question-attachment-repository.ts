import type { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentRepository
	implements QuestionAttachmentRepository
{
	public items: QuestionAttachment[] = [];

	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const QuestionAttachments = this.items.filter(
			(item) => item.questionId.toString() === questionId,
		);

		return Promise.resolve(QuestionAttachments);
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		);
		this.items = questionAttachments;
		return Promise.resolve();
	}
}
