import type { Either } from '@/core/either';
import { left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';

import { Injectable } from '@nestjs/common';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentRepository } from '../repositories/answer-comment-repository';
import { AnswerRepository } from '../repositories/answer-repository';

interface CommentOnAnswerPayload {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerResult = Either<
	NotAllowedError,
	{ answerComment: AnswerComment }
>;

@Injectable()
export class CommentOnAnswerUseCase {
	constructor(
		private answerRepository: AnswerRepository,
		private answerCommentRepository: AnswerCommentRepository,
	) {}
	async execute(
		payload: CommentOnAnswerPayload,
	): Promise<CommentOnAnswerResult> {
		const answer = await this.answerRepository.findById(payload.answerId);

		if (!answer) return left(new NotAllowedError());

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(payload.authorId),
			answerId: new UniqueEntityId(payload.answerId),
			content: payload.content,
		});

		await this.answerCommentRepository.create(answerComment);

		return right({
			answerComment,
		});
	}
}
