import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { CurrentUser } from '@/infra/authentication/current-user-decorator';
import { UserPayload } from '@/infra/authentication/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from '@nestjs/common';
import { z } from 'zod';

const answerQuestionBodySchema = z.object({
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('questionId') questionId: string,
	): Promise<void> {
		const { content, attachments } = body;
		const userId = user.sub;

		const result = await this.answerQuestion.execute({
			content,
			questionId,
			authorId: userId,
			attachmentsId: attachments,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
