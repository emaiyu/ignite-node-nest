import type { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentRepository
	implements AnswerAttachmentRepository
{
	public items: AnswerAttachment[] = [];

	async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const answerAttachments = this.items.filter(
			(item) => item.answerId.toString() === answerId,
		);

		return Promise.resolve(answerAttachments);
	}

	async createMany(attachments: AnswerAttachment[]): Promise<void> {
		this.items.push(...attachments);
		return Promise.resolve();
	}

	async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
		const answerAttachments = this.items.filter((item) => {
			return !attachments.some((attachment) => attachment.equals(item));
		});

		this.items = answerAttachments;
		return Promise.resolve();
	}

	async deleteManyByAnswerId(answerId: string): Promise<void> {
		const answerAttachments = this.items.filter(
			(item) => item.answerId.toString() !== answerId,
		);

		this.items = answerAttachments;
		return Promise.resolve();
	}
}
