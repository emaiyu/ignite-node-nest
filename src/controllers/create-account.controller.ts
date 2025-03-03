import {
	Body,
	ConflictException,
	Controller,
	Post,
	UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const Schema = {
	body: {
		create: z.object({
			name: z.string(),
			email: z.string(),
			password: z.string(),
		}),
	},
};

const BodySchema = Schema['body']['create'];
type Payload = z.infer<(typeof Schema)['body']['create']>;

@Controller('/accounts')
export class CreateAccountController {
	constructor(private readonly prisma: PrismaService) {}

	// @HttpCode(201)
	@Post()
	@UsePipes(new ZodValidationPipe(BodySchema))
	async handle(@Body() body: Payload) {
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
