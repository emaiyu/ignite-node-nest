import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import {
	AnswerComment,
	AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeAnswerComment(
	override: Partial<AnswerCommentProps> = {},
	id?: UniqueEntityId,
): AnswerComment {
	const answer = AnswerComment.create(
		{
			authorId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return answer;
}

@Injectable()
export class AnswerCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswerComment(
		data: Partial<AnswerCommentProps> = {},
	): Promise<AnswerComment> {
		const answerComment = makeAnswerComment(data);

		await this.prisma.comment.create({
			data: PrismaAnswerCommentMapper.toPrisma(answerComment),
		});

		return answerComment;
	}
}
