import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
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

const editAnswerBodySchema = z.object({
	content: z.string(),
	attachments: z.array(z.string().uuid()).default([]),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller('/answers/:id')
export class EditAnswerController {
	constructor(private editAnswer: EditAnswerUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditAnswerBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('id') answerId: string,
	): Promise<void> {
		const { content, attachments } = body;
		const userId = user.sub;

		const result = await this.editAnswer.execute({
			content,
			answerId,
			authorId: userId,
			attachmentsId: attachments,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
