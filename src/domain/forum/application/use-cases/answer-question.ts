import { right, type Either } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import type { AnswerRepository } from '../repositories/answer-repository';

interface AnswerQuestionPayload {
	instructorId: string;
	questionId: string;
	content: string;
	attachmentsId: string[];
}

type AnswerQuestionResult = Either<
	null,
	{
		answer: Answer;
	}
>;

export class AnswerQuestionUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute(payload: AnswerQuestionPayload): Promise<AnswerQuestionResult> {
		const answer = Answer.create({
			content: payload.content,
			authorId: new UniqueEntityId(payload.instructorId),
			questionId: new UniqueEntityId(payload.questionId),
		});

		const attachments = payload.attachmentsId.map((attachmentId) => {
			return AnswerAttachment.create({
				answerId: answer.id,
				attachmentId: new UniqueEntityId(attachmentId),
			});
		});

		answer.attachments = new AnswerAttachmentList(attachments);

		await this.answerRepository.create(answer);
		return right({ answer });
	}
}
