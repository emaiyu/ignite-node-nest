import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import {
	QuestionPresenter,
	ToHTTP,
} from '@/infra/presenters/question-presenter';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
	constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

	@Get()
	async handle(@Param('slug') slug: string): Promise<{
		question: ToHTTP;
	}> {
		const result = await this.getQuestionBySlug.execute({
			slug,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return { question: QuestionPresenter.toHTTP(result.value.question) };
	}
}
