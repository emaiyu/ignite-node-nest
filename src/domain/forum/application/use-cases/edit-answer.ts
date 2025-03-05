import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

import { Injectable } from '@nestjs/common';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository';
import { AnswerRepository } from '../repositories/answer-repository';

interface EditAnswerPayload {
	authorId: string;
	answerId: string;
	content: string;
	attachmentsId: string[];
}

type EditAnswerResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer;
	}
>;

@Injectable()
export class EditAnswerUseCase {
	constructor(
		private answerRepository: AnswerRepository,
		private answerAttachmentRepository: AnswerAttachmentRepository,
	) {}
	async execute(payload: EditAnswerPayload): Promise<EditAnswerResult> {
		const answer = await this.answerRepository.findById(payload.answerId);
		if (!answer) return left(new ResourceNotFoundError());
		if (answer.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		const currentAnswerAttachments =
			await this.answerAttachmentRepository.findManyByAnswerId(
				payload.answerId,
			);

		const answerAttachmentList = new AnswerAttachmentList(
			currentAnswerAttachments,
		);

		const attachments = payload.attachmentsId.map((attachmentId) => {
			return AnswerAttachment.create({
				answerId: answer.id,
				attachmentId: new UniqueEntityId(attachmentId),
			});
		});

		answerAttachmentList.update(attachments);

		answer.attachments = answerAttachmentList;

		answer.content = payload.content;

		await this.answerRepository.save(answer);
		return right({ answer });
	}
}
