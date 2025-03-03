import { JwtAuthGuard } from '@/authentication/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Question } from '@prisma/client';
import { z } from 'zod';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	async handle(
		@Query('page', new ZodValidationPipe(pageQueryParamSchema))
		page: PageQueryParam,
	): Promise<{ questions: Question[] }> {
		const perPage = 20;
		const questions = await this.prisma.question.findMany({
			take: perPage,
			skip: (page - 1) * perPage,
			orderBy: { createdAt: 'desc' },
		});
		return { questions };
	}
}
