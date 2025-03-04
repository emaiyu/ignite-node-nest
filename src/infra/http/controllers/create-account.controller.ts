import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
	Body,
	ConflictException,
	Controller,
	Post,
	UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const BodySchema = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
});

type BodyPayload = z.infer<typeof BodySchema>;

@Controller('/accounts')
export class CreateAccountController {
	constructor(private readonly prisma: PrismaService) {}

	// @HttpCode(201)
	@Post()
	@UsePipes(new ZodValidationPipe(BodySchema))
	async handle(@Body() body: BodyPayload): Promise<void> {
		const { name, email, password } = body;
		const userWithSameEmail = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (userWithSameEmail)
			throw new ConflictException('User with same email already exists.');

		const hashedPassword = await hash(password, 8);

		await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	}
}
