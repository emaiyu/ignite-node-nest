import type { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentRepository
	implements QuestionAttachmentRepository
{
	public items: QuestionAttachment[] = [];

	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() === questionId,
		);

		return Promise.resolve(questionAttachments);
	}

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items.push(...attachments);
		return Promise.resolve();
	}

	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
		const questionAttachments = this.items.filter((item) => {
			return !attachments.some((attachment) => attachment.equals(item));
		});

		this.items = questionAttachments;
		return Promise.resolve();
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		);

		this.items = questionAttachments;

		return Promise.resolve();
	}
}
