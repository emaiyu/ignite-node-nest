import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { CurrentUser } from '@/infra/authentication/current-user-decorator';
import { JwtAuthGuard } from '@/infra/authentication/jwt-auth.guard';
import { UserPayload } from '@/infra/authentication/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';

const BodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type BodyPayload = z.infer<typeof BodySchema>;

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private readonly useCase: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@Body(new ZodValidationPipe(BodySchema)) body: BodyPayload,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		const { content, title } = body;
		const userId = user.sub;

		await this.useCase.execute({
			authorId: userId,
			title,
			content,
			attachmentsId: [],
		});
	}
}
