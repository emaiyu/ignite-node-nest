import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import type { Question } from '@/domain/forum/enterprise/entities/question';

import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import type { QuestionAttachmentRepository } from '../repositories/question-attachment-repository';
import type { QuestionRepository } from '../repositories/question-repository';

interface EditQuestionPayload {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsId: string[];
}

type EditQuestionResult = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(
		private questionRepository: QuestionRepository,
		private questionAttachmentRepository: QuestionAttachmentRepository,
	) {}
	async execute(payload: EditQuestionPayload): Promise<EditQuestionResult> {
		const question = await this.questionRepository.findById(payload.questionId);
		if (!question) return left(new ResourceNotFoundError());
		if (question.authorId.toString() !== payload.authorId)
			return left(new NotAllowedError());

		const currentQuestionAttachments =
			await this.questionAttachmentRepository.findManyByQuestionId(
				payload.questionId,
			);

		const questionAttachmentList = new QuestionAttachmentList(
			currentQuestionAttachments,
		);

		const attachments = payload.attachmentsId.map((attachmentId) => {
			return QuestionAttachment.create({
				questionId: question.id,
				attachmentId: new UniqueEntityId(attachmentId),
			});
		});

		questionAttachmentList.update(attachments);

		question.attachments = questionAttachmentList;
		question.title = payload.title;
		question.content = payload.content;

		await this.questionRepository.save(question);
		return right({ question });
	}
}
