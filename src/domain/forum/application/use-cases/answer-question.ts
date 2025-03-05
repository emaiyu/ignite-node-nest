import { right, type Either } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Injectable } from '@nestjs/common';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerRepository } from '../repositories/answer-repository';

interface AnswerQuestionPayload {
	authorId: string;
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

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute(payload: AnswerQuestionPayload): Promise<AnswerQuestionResult> {
		const answer = Answer.create({
			content: payload.content,
			authorId: new UniqueEntityId(payload.authorId),
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
