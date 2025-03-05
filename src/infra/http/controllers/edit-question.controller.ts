import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { CurrentUser } from '@/infra/authentication/current-user-decorator';
import { UserPayload } from '@/infra/authentication/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from '@nestjs/common';
import { z } from 'zod';

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('id') questionId: string,
	): Promise<void> {
		const { title, content, attachments } = body;
		const userId = user.sub;

		const result = await this.editQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsId: attachments,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
