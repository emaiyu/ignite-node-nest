import { CurrentUser } from '@/authentication/current-user-decorator';
import { JwtAuthGuard } from '@/authentication/jwt-auth.guard';
import { UserPayload } from '@/authentication/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
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
	constructor(private readonly prisma: PrismaService) {}
	@Post()
	async handle(
		@Body(new ZodValidationPipe(BodySchema)) body: BodyPayload,
		@CurrentUser() user: UserPayload,
	) {
		const { content, title } = body;
		const userId = user.sub;

		const slug = this.convertToSlug(title);

		await this.prisma.question.create({
			data: {
				title,
				content,
				authorId: userId,
				slug,
			},
		});
	}

	private convertToSlug(text: string): string {
		return text
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
	}
}
