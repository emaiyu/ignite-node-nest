import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
	QuestionPresenter,
	ToHTTP,
} from '@/infra/presenters/question-presenter';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParam = z.infer<typeof pageQueryParamSchema>;

@Controller('questions')
export class FetchRecentQuestionsController {
	constructor(private readonly useCase: FetchRecentQuestionUseCase) {}

	@Get()
	async handle(
		@Query('page', new ZodValidationPipe(pageQueryParamSchema))
		page: PageQueryParam,
	): Promise<{ questions: ToHTTP[] }> {
		const result = await this.useCase.execute({
			page,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const questions = result.value.questions.map((question) =>
			QuestionPresenter.toHTTP(question),
		);

		return {
			questions,
		};
	}
}
