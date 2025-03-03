import type { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentRepository
	implements AnswerAttachmentRepository
{
	public items: AnswerAttachment[] = [];

	async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const AnswerAttachments = this.items.filter(
			(item) => item.answerId.toString() === answerId,
		);

		return Promise.resolve(AnswerAttachments);
	}

	async deleteManyByAnswerId(answerId: string): Promise<void> {
		const answerAttachments = this.items.filter(
			(item) => item.answerId.toString() !== answerId,
		);
		this.items = answerAttachments;
		return Promise.resolve();
	}
}
