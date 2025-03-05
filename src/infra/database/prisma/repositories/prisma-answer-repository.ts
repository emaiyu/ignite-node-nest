import { PaginationParams } from '@/core/repositories/paginate-params';
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerRepository implements AnswerRepository {
	constructor(
		private prisma: PrismaService,
		private answerAttachmentRepository: AnswerAttachmentRepository,
	) {}

	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		});

		if (!answer) {
			return null;
		}

		return PrismaAnswerMapper.toDomain(answer);
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return answers.map((item) => PrismaAnswerMapper.toDomain(item));
	}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await this.prisma.answer.create({
			data,
		});

		await this.answerAttachmentRepository.createMany(
			answer.attachments.getItems(),
		);
	}

	async save(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await Promise.all([
			this.prisma.answer.update({
				where: {
					id: answer.id.toString(),
				},
				data,
			}),
			this.answerAttachmentRepository.createMany(
				answer.attachments.getNewItems(),
			),
			this.answerAttachmentRepository.deleteMany(
				answer.attachments.getRemovedItems(),
			),
		]);
	}

	async delete(answer: Answer): Promise<void> {
		await this.prisma.answer.delete({
			where: {
				id: answer.id.toString(),
			},
		});
	}
}
