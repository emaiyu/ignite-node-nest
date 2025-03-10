import type { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

export abstract class AnswerAttachmentRepository {
	abstract createMany(attachments: AnswerAttachment[]): Promise<void>;
	abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>;
	abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
	abstract deleteManyByAnswerId(answerId: string): Promise<void>;
}
