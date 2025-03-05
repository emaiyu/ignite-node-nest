import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
	CommentWithAuthorPresenter,
	ToHTTP,
} from '@/infra/presenters/comment-with-author-presenter';
import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from '@nestjs/common';
import { z } from 'zod';

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

	@Get()
	async handle(
		@Query('page', queryValidationPipe) page: PageQueryParamSchema,
		@Param('answerId') answerId: string,
	): Promise<{ comments: ToHTTP[] }> {
		const result = await this.fetchAnswerComments.execute({
			page,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const comments = result.value.comments;

		return {
			comments: comments.map((item) => CommentWithAuthorPresenter.toHTTP(item)),
		};
	}
}
