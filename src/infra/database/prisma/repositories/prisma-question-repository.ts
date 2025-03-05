/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/paginate-params';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachment-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
	constructor(
		private prisma: PrismaService,
		private questionAttachmentsRepository: QuestionAttachmentRepository,
		private cache: CacheRepository,
	) {}

	async findById(id: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				id,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async findBySlug(slug: string) {
		const cacheHit = await this.cache.get(`question:${slug}:details`);

		if (cacheHit) {
			const cacheData = JSON.parse(cacheHit);

			return cacheData;
		}

		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
			include: {
				author: true,
				attachments: true,
			},
		});

		if (!question) {
			return null;
		}

		const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

		await this.cache.set(
			`question:${slug}:details`,
			JSON.stringify(questionDetails),
		);

		return questionDetails;
	}

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
			include: {
				author: true,
				attachments: true,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionDetailsMapper.toDomain(question);
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return questions.map((item) => PrismaQuestionMapper.toDomain(item));
	}

	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		await this.prisma.question.create({
			data,
		});

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		await Promise.all([
			this.prisma.question.update({
				where: {
					id: question.id.toString(),
				},
				data,
			}),
			this.questionAttachmentsRepository.createMany(
				question.attachments.getNewItems(),
			),
			this.questionAttachmentsRepository.deleteMany(
				question.attachments.getRemovedItems(),
			),
			this.cache.delete(`question:${data.slug}:details`),
		]);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		await this.prisma.question.delete({
			where: {
				id: data.id,
			},
		});
	}
}
